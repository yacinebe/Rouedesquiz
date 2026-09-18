// GET /api/health → is this deployment wired up? Says which env vars it can see
// (never their values), who the token belongs to and what it may do on the repo,
// to catch "wrong project", "stale deployment" and "read-only token" mistakes.
const REPO = process.env.BACKLOG_REPO || 'yacinebe/Rouedesquiz';
const TOKEN = process.env.GITHUB_TOKEN;

async function ask(path) {
  const r = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json',
               'User-Agent': 'quizroulette-backlog' },
  });
  const text = await r.text();
  let json = null; try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: r.status, json, text: json ? null : text.slice(0, 200) };
}

module.exports = async (req, res) => {
  const out = {
    hasGithubToken: !!TOKEN,
    hasBacklogKey: !!process.env.BACKLOG_KEY,
    tokenLooksLike: TOKEN ? (TOKEN.startsWith('github_pat_') ? 'fine-grained'
      : TOKEN.startsWith('ghp_') ? 'classic' : 'unknown') : null,
    tokenTail: TOKEN ? `…${TOKEN.slice(-4)}` : null,   // to tell two tokens apart
    repo: REPO,
    vercel: {
      env: process.env.VERCEL_ENV || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF || null,
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null,
    },
  };

  if (TOKEN) {
    const repo = await ask(`/repos/${REPO}`);
    out.repoAccess = {
      status: repo.status,
      permissions: repo.json && repo.json.permissions || null,   // {admin, push, pull}
      message: repo.json && repo.json.message || repo.text || null,
    };
    // Can it read the file it needs to write? (A write is never attempted here.)
    const file = await ask(`/repos/${REPO}/contents/BACKLOG_FUNCTIONAL.md?ref=main`);
    out.canReadBacklog = file.status === 200;
    // Branch protection on main would block writes even with a valid token.
    const branch = await ask(`/repos/${REPO}/branches/main`);
    out.mainProtected = branch.json ? !!branch.json.protected : null;
  }

  res.json(out);
};
