#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Migrate questions.js  →  Supabase `questions` table.

   One-off / re-runnable. Upserts on `legacy_id` (e.g. 'math-001'),
   so running it again after adding questions only inserts the new
   ones and updates changed ones — no duplicates.

   Needs the SERVICE-ROLE key (bypasses RLS to write questions).
   That key is an admin secret — pass it via env var, never commit it:

     # PowerShell
     $env:SUPABASE_URL="https://pidiymkmondkiaanzyyy.supabase.co"
     $env:SUPABASE_SECRET_KEY = Read-Host "Secret key"   # typed, so it stays out of history
     node tools/migrate-questions-to-db.js

     # bash
     SUPABASE_URL=... SUPABASE_SECRET_KEY=... node tools/migrate-questions-to-db.js

   No npm install required (uses Node 18+ built-in fetch).
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
// Prefer the new-style secret key (sb_secret_…); fall back to the legacy
// service_role JWT for as long as legacy keys are still enabled.
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env. Set SUPABASE_URL and SUPABASE_SECRET_KEY (or the legacy SUPABASE_SERVICE_ROLE_KEY).');
  process.exit(1);
}
// Surrounding whitespace/quotes come along for free when pasting; strip them.
const KEY = SERVICE_KEY.trim().replace(/^["']|["']$/g, '');

// Anything left outside printable ASCII is pasted prose, not a key — and would
// otherwise fail deep inside fetch with an unreadable ByteString error.
const badAt = [...KEY].findIndex(c => c < '\x21' || c > '\x7E');
if (badAt !== -1) {
  const c = KEY[badAt];
  console.error(`The key has an unexpected character at position ${badAt + 1}: ` +
    `"${c}" (code ${c.codePointAt(0)}).`);
  console.error(`Length ${KEY.length}, starts with "${KEY.slice(0, 12)}…".`);
  console.error('A real key is one unbroken run of letters/digits — no spaces, arrows or accents.');
  console.error('Which variable is in use: ' +
    (process.env.SUPABASE_SECRET_KEY ? 'SUPABASE_SECRET_KEY' : 'SUPABASE_SERVICE_ROLE_KEY'));
  console.error('Clear the other one if it is stale:');
  console.error('  Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue');
  process.exit(1);
}
if (typeof fetch !== 'function') {
  console.error('Node 18+ required (global fetch not found).');
  process.exit(1);
}

// ── Load window.QUIZ_DATA from questions.js without a browser ──
const src = fs.readFileSync(path.join(__dirname, '..', 'questions.js'), 'utf8');
const win = {};
// questions.js is `window.QUIZ_DATA = {...}` — run it with a fake window.
new Function('window', src)(win);
const QUIZ_DATA = win.QUIZ_DATA;
if (!QUIZ_DATA) { console.error('Could not read window.QUIZ_DATA from questions.js'); process.exit(1); }

// ── Flatten to rows ──
const rows = [];
for (const [theme, arr] of Object.entries(QUIZ_DATA)) {
  if (!Array.isArray(arr)) continue; // skip `metadata`
  arr.forEach((q, i) => {
    if (!q || !q.question || !Array.isArray(q.options)) return;
    rows.push({
      theme,
      difficulty: q.difficulty ?? null,
      question: q.question,
      options: q.options,
      answer: q.answer,
      image: q.image ?? null,
      option_images: q.optionImages ?? null,
      legacy_id: q.id || `${theme}-${String(i + 1).padStart(3, '0')}`
    });
  });
}
console.log(`Prepared ${rows.length} questions across ${Object.keys(QUIZ_DATA).filter(k => Array.isArray(QUIZ_DATA[k])).length} themes.`);

// Basic sanity: answer must be one of options.
const bad = rows.filter(r => !r.options.includes(r.answer));
if (bad.length) {
  console.warn(`⚠ ${bad.length} rows where answer ∉ options (first: ${bad[0].legacy_id}). Uploading anyway.`);
}

// ── Upsert in chunks ──
const ENDPOINT = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/questions?on_conflict=legacy_id`;
const HEADERS = {
  'apikey': KEY,
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates,return=minimal'
};
const CHUNK = 200;

(async () => {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const res = await fetch(ENDPOINT, { method: 'POST', headers: HEADERS, body: JSON.stringify(batch) });
    if (!res.ok) {
      console.error(`Batch ${i}-${i + batch.length} failed: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    console.log(`Upserted ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }
  console.log('✅ Done.');
})();
