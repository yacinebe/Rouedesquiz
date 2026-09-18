// GET /api/health → is this deployment wired up? Says which env vars it can see
// (never their values) plus which deployment answered, to catch "wrong project"
// and "variables added after the build" mistakes.
module.exports = (req, res) => {
  res.json({
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    hasBacklogKey: !!process.env.BACKLOG_KEY,
    repo: process.env.BACKLOG_REPO || 'yacinebe/Rouedesquiz (default)',
    vercel: {
      env: process.env.VERCEL_ENV || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF || null,
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null,
      project: process.env.VERCEL_PROJECT_PRODUCTION_URL || null,
    },
  });
};
