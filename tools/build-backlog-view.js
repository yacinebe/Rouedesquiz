#!/usr/bin/env node
/*
 * build-backlog-view.js — regenerate the HTML backlog viewer.
 *
 * Reads BACKLOG_FUNCTIONAL.md + BACKLOG_TECHNICAL.md (the single source of truth),
 * parses their tables / strategic note / shipped list, MERGES both backlogs into one
 * dependency-respecting, priority-weighted order, and writes backlog.html using
 * tools/backlog-view.template.html.
 *
 * Ordering ("logical order"):
 *   1. Topological — an item never appears before an item it depends on.
 *   2. Effective priority — a prerequisite inherits the urgency of the most urgent
 *      item it unblocks (a Low task blocking a High one is pulled forward).
 *   3. Tie-breaks — unblock-more-first (dependent count), then own priority, then
 *      functional-before-technical, then natural id order.
 *
 * Usage:  node tools/build-backlog-view.js       (no dependencies; Node 18+)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(__dirname, 'backlog-view.template.html');
const OUT = path.join(ROOT, 'backlog.html');

const SOURCES = {
  functional: { file: 'BACKLOG_FUNCTIONAL.md', accent: '#E8464E', accentSoft: '#FBE4E4' },
  technical:  { file: 'BACKLOG_TECHNICAL.md',  accent: '#0E8E7C', accentSoft: '#D8F0EB' },
};
const PRI_RANK = { High: 0, Med: 1, Low: 2 };
const pri = p => PRI_RANK[p] ?? 3; // '—' (Done rows) sorts last

// --- minimal inline markdown -> HTML (escape first, then bold/code/italic) ---
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function mdInline(s) {
  s = esc(s || '');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // drop links, keep label
  return s.trim();
}

function splitItem(cell) {
  const m = cell.match(/^\s*\*\*(.+?)\*\*\s*([\s\S]*)$/);
  if (!m) return { title: mdInline(cell), desc: '' };
  return { title: mdInline(m[1]), desc: mdInline(m[2].replace(/^[\s—–-]+/, '')) };
}
function parseDeps(cell) {
  const raw = cell.trim();
  if (!raw || raw === '—' || raw === '-') return [];
  return raw.split(',').map(x => x.trim()).filter(Boolean);
}
function isSeparatorRow(cells) {
  return cells.every(c => /^:?-+:?$/.test(c.replace(/\s/g, '')));
}

function parse(md, track) {
  const lines = md.split(/\r?\n/);
  const items = [];
  const shipped = [];
  let inShipped = false;
  let note = '';

  for (const line of lines) {
    if (!note && /^>\s*\*\*Strategic/i.test(line)) { note = mdInline(line.replace(/^>\s*/, '')); continue; }
    if (/^##\s+Shipped/i.test(line)) { inShipped = true; continue; }
    if (/^##\s+/.test(line)) { inShipped = false; }
    if (inShipped && /^-\s/.test(line)) { shipped.push(mdInline(line.replace(/^-\s*✓?\s*/, ''))); continue; }

    if (/^\s*\|/.test(line)) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.length < 6 || cells[0] === 'ID' || isSeparatorRow(cells)) continue;
      const { title, desc } = splitItem(cells[1]);
      items.push({
        id: cells[0], title, desc,
        size: cells[2], priority: cells[3],
        deps: parseDeps(cells[4]), status: cells[5], track,
      });
    }
  }
  return { items, shipped, note };
}

// merge both backlogs into one dependency-respecting, priority-weighted order
function logicalOrder(items) {
  const byId = new Map(items.map(i => [i.id, i]));
  const known = new Set(byId.keys());

  // prerequisites limited to items actually in the backlog (ignore prose deps like "art")
  const prereq = new Map();
  const dependents = new Map(items.map(i => [i.id, 0]));
  for (const it of items) {
    const pr = it.deps.filter(d => known.has(d));
    prereq.set(it.id, pr);
    pr.forEach(d => dependents.set(d, dependents.get(d) + 1));
  }

  // effective urgency: a task is at least as urgent as the most urgent thing it unblocks
  const eff = new Map(items.map(i => [i.id, pri(i.priority)]));
  let changed = true;
  while (changed) {
    changed = false;
    for (const it of items) {
      for (const d of prereq.get(it.id)) {
        if (eff.get(d) > eff.get(it.id)) { eff.set(d, eff.get(it.id)); changed = true; }
      }
    }
  }

  const emitted = new Set();
  const remaining = new Set(byId.keys());
  const result = [];
  while (remaining.size) {
    let avail = [...remaining].filter(id => prereq.get(id).every(d => emitted.has(d)));
    if (!avail.length) avail = [...remaining]; // cycle guard (shouldn't happen)
    avail.sort((a, b) => {
      const A = byId.get(a), B = byId.get(b);
      return (eff.get(a) - eff.get(b))                            // effective urgency
        || (dependents.get(b) - dependents.get(a))               // unblock more first
        || (pri(A.priority) - pri(B.priority))                   // own priority
        || (A.track === B.track ? 0 : A.track === 'functional' ? -1 : 1)
        || a.localeCompare(b, undefined, { numeric: true });
    });
    const pick = avail[0];
    emitted.add(pick); remaining.delete(pick);
    result.push(byId.get(pick));
  }
  return result;
}

function build() {
  if (!fs.existsSync(TEMPLATE)) { console.error(`Template not found: ${TEMPLATE}`); process.exit(1); }

  const data = { generatedAt: new Date().toISOString().slice(0, 10), accents: {}, notes: {} };
  const all = [];
  for (const [key, cfg] of Object.entries(SOURCES)) {
    const p = path.join(ROOT, cfg.file);
    if (!fs.existsSync(p)) { console.error(`Source not found: ${p}`); process.exit(1); }
    const parsed = parse(fs.readFileSync(p, 'utf8'), key);
    if (!parsed.items.length) { console.error(`No table rows parsed from ${cfg.file}.`); process.exit(1); }
    data.accents[key] = { accent: cfg.accent, accentSoft: cfg.accentSoft };
    data.notes[key] = parsed.note;
    all.push(...parsed.items);
    const done = parsed.items.filter(i => i.status === 'Done').length;
    console.log(`  ${cfg.file}: ${parsed.items.length} items (${done} done)`);
  }

  const ordered = logicalOrder(all);
  ordered.forEach((it, i) => { it.seq = i + 1; });
  data.items = ordered;

  // report any dependency that couldn't be placed before its dependent (i.e. a cycle)
  const pos = new Map(ordered.map((it, i) => [it.id, i]));
  const idset = new Set(ordered.map(it => it.id));
  const broken = [];
  for (const it of ordered)
    for (const d of it.deps)
      if (idset.has(d) && pos.get(d) > pos.get(it.id)) broken.push([it.id, d]);
  if (broken.length) {
    console.warn('\n  ⚠ circular dependency — cannot order these after their prerequisite:');
    broken.forEach(([a, b]) => console.warn(`     ${a} → depends on ${b}, but ${b} also (transitively) depends on ${a}.`));
    console.warn('  The table flags the offending link with ↻. Remove one side in the source .md for a clean linear order.\n');
  }

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const injected = template.replace('/*__DATA__*/ {}', JSON.stringify(data, null, 2));
  if (injected === template) { console.error('Injection marker not found in template.'); process.exit(1); }
  fs.writeFileSync(OUT, injected);
  console.log(`✓ Wrote ${path.relative(ROOT, OUT)} — ${ordered.length} items merged into one ordered table`);
}

build();
