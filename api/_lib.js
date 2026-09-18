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
  text.split('\n').forEach((line, i) => {
    const m = line.match(ROW);
    if (!m) return;
    const cells = m[2].split('|').map(c => c.trim());
    if (cells.length < 5) return;
    rows.push({
      backlog: which,
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

module.exports = { REPO, FILES, guard, body, gh, repoPath, readFile, parseRows, writeStory, titleOf };
