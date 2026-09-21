// Shared helpers for the backlog control panel API (see /backlog).
// No dependencies: plain Node serverless functions on Vercel.

const REPO = process.env.BACKLOG_REPO || 'yacinebe/Rouedesquiz';
const TOKEN = process.env.GITHUB_TOKEN;
const KEY = process.env.BACKLOG_KEY;

const FILES = {
  functional: 'BACKLOG_FUNCTIONAL.md',
  technical: 'BACKLOG_TECHNICAL.md',
};

// ── auth ──────────────────────────────────────────────────────────────
// Single shared password, sent as a header. Keeps the panel (which can
// create issues and start paid Claude runs) closed to the internet.
function guard(req, res) {
  if (!KEY || !TOKEN) {
    res.status(500).json({ error: 'Server not configured: set GITHUB_TOKEN and BACKLOG_KEY in Vercel.' });
    return false;
  }
  if (req.headers['x-backlog-key'] !== KEY) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return false;
  }
  return true;
}

function body(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body;
}

// ── GitHub REST ───────────────────────────────────────────────────────
async function gh(path, opts = {}) {
  const r = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'quizroulette-backlog',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`GitHub ${r.status} on ${path}: ${(await r.text()).slice(0, 300)}`);
  return r.status === 204 ? null : r.json();
}

const repoPath = p => `/repos/${REPO}${p}`;

// ── backlog markdown ──────────────────────────────────────────────────
// Rows look like: | F-01 | **Title** — text | M | High | F-02 | Todo |
const ROW = /^\|\s*([FT]-\d+)\s*\|(.*)\|\s*$/;

async function readFile(which) {
  const file = FILES[which];
  if (!file) throw new Error(`Unknown backlog: ${which}`);
  const data = await gh(repoPath(`/contents/${file}?ref=main`));
  return { file, sha: data.sha, text: Buffer.from(data.content, 'base64').toString('utf8') };
}

function parseRows(text, which) {
  const rows = [];
  // Rows belong to the "## <n>. <Theme>" heading above them (Graphics & Sound,
  // Game play, Curriculum); the technical file is the Non-functional theme.
  let theme = which === 'technical' ? 'Non-functional' : 'Unsorted';
  text.split('\n').forEach((line, i) => {
    const h = line.match(/^##\s+(?:\d+\.\s*)?(.+?)\s*$/);
    if (h) theme = h[1];
    const m = line.match(ROW);
    if (!m) return;
    const cells = m[2].split('|').map(c => c.trim());
    if (cells.length < 5) return;
    rows.push({
      backlog: which,
      theme,
      id: m[1],
      line: i,
      item: cells[0],
      size: cells[1],
      priority: cells[2],
      depends: cells[3],
      status: cells[4],
      title: titleOf(cells[0]),
    });
  });
  return rows;
}

// "**Read-aloud (TTS)** — voice reads…" → "Read-aloud (TTS)"
function titleOf(item) {
  const bold = item.match(/\*\*(.+?)\*\*/);
  return (bold ? bold[1] : item.split('—')[0]).replace(/\s+/g, ' ').trim();
}

function rowLine(r) {
  return `| ${r.id} | ${r.item} | ${r.size} | ${r.priority} | ${r.depends} | ${r.status} |`;
}

// Replace one story's row in place and commit it.
async function writeStory(which, id, fields, message) {
  const { file, sha, text } = await readFile(which);
  const lines = text.split('\n');
  const idx = lines.findIndex(l => (l.match(ROW) || [])[1] === id);
  if (idx === -1) throw new Error(`Story ${id} not found in ${file}`);
  const current = parseRows(text, which).find(r => r.id === id);
  const next = { ...current, ...fields, id };
  lines[idx] = rowLine(next);
  await gh(repoPath(`/contents/${file}`), {
    method: 'PUT',
    body: JSON.stringify({
      message: message || `Backlog: update ${id}`,
      content: Buffer.from(lines.join('\n'), 'utf8').toString('base64'),
      sha,
      branch: 'main',
    }),
  });
  return next;
}

// Add a brand-new story to the right theme section, with the next free ID.
// New rows go at the top of their section, where they are easy to find.
async function createStory({ theme, title, description, size, priority, depends }) {
  const which = theme === 'Non-functional' ? 'technical' : 'functional';
  const prefix = which === 'technical' ? 'T' : 'F';
  const { file, sha, text } = await readFile(which);

  // Next ID must clear both files: F-41 and T-41 can't collide with themselves.
  const other = await readFile(which === 'technical' ? 'functional' : 'technical');
  const used = [...text.matchAll(/^\|\s*[FT]-(\d+)/gm), ...other.text.matchAll(/^\|\s*[FT]-(\d+)/gm)]
    .map(m => Number(m[1]));
  const id = `${prefix}-${String(Math.max(0, ...used) + 1).padStart(2, '0')}`;

  const lines = text.split('\n');
  // Find the table under this theme's heading (technical file has one table).
  let start = which === 'technical' ? 0 : lines.findIndex(l =>
    /^##\s/.test(l) && l.replace(/^##\s+(?:\d+\.\s*)?/, '').trim() === theme);
  if (start === -1) throw new Error(`No section for theme "${theme}" in ${file}`);
  const sep = lines.findIndex((l, i) => i > start && /^\|[-: |]+\|$/.test(l));
  if (sep === -1) throw new Error(`No table found under "${theme}"`);

  const item = `**${title.trim()}**${description && description.trim() ? ` — ${description.trim()}` : ''}`;
  const row = { id, item, size: size || 'M', priority: priority || 'Med',
                depends: (depends || '').trim() || '—', status: 'Todo' };
  lines.splice(sep + 1, 0, rowLine(row));

  await gh(repoPath(`/contents/${file}`), {
    method: 'PUT',
    body: JSON.stringify({
      message: `Backlog: add ${id} — ${title.trim()}`,
      content: Buffer.from(lines.join('\n'), 'utf8').toString('base64'),
      sha,
      branch: 'main',
    }),
  });
  return { ...row, backlog: which, theme, title: titleOf(item) };
}

// Remove a story's row entirely. Used for test/obsolete stories; the git
// history keeps the text if it is ever needed again.
async function deleteStory(which, id) {
  const { file, sha, text } = await readFile(which);
  const lines = text.split('\n');
  const idx = lines.findIndex(l => (l.match(ROW) || [])[1] === id);
  if (idx === -1) throw new Error(`Story ${id} not found in ${file}`);
  const [removed] = lines.splice(idx, 1);
  await gh(repoPath(`/contents/${file}`), {
    method: 'PUT',
    body: JSON.stringify({
      message: `Backlog: remove ${id}`,
      content: Buffer.from(lines.join('\n'), 'utf8').toString('base64'),
      sha,
      branch: 'main',
    }),
  });
  return { id, removed };
}

module.exports = { REPO, FILES, guard, body, gh, repoPath, readFile, parseRows, writeStory, createStory, deleteStory, titleOf };
