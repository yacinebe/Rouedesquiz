// GET /api/pipeline → live GitHub state per story: issue → Claude run → branch/PR → preview → merged.
const { guard, gh, repoPath } = require('./_lib');

const PREVIEW = /https:\/\/rouedesquiz-git-[a-z0-9-]+\.vercel\.app/i;
let cache = { at: 0, data: null };

module.exports = async (req, res) => {
  if (!guard(req, res)) return;
  try {
    if (cache.data && Date.now() - cache.at < 20000 && !req.query.fresh) return res.json(cache.data);

    const [issuesRaw, pulls, runsRaw, deploys] = await Promise.all([
      gh(repoPath('/issues?state=all&per_page=100')),
      gh(repoPath('/pulls?state=all&per_page=50')),
      gh(repoPath('/actions/runs?per_page=50')),
      gh(repoPath('/deployments?environment=Production&per_page=10')).catch(() => []),
    ]);
    const issues = issuesRaw.filter(i => !i.pull_request);
    const runs = runsRaw.workflow_runs || [];

    // Preview URLs come from the Vercel bot's comment on each PR (open ones only).
    const previews = {};
    await Promise.all(pulls.filter(p => p.state === 'open').slice(0, 10).map(async p => {
      try {
        const comments = await gh(repoPath(`/issues/${p.number}/comments?per_page=20`));
        for (const c of comments) {
          const m = (c.body || '').match(PREVIEW);
          if (m) previews[p.number] = m[0];
        }
      } catch { /* preview is a nicety, never fail the whole call for it */ }
    }));

    // Vercel records a Production deployment per merge; its status tells us
    // whether the merged code is actually live yet.
    const prodBySha = {};
    await Promise.all((deploys || []).slice(0, 6).map(async d => {
      try {
        const st = await gh(repoPath(`/deployments/${d.id}/statuses?per_page=1`));
        prodBySha[d.sha] = { state: st[0] ? st[0].state : 'pending', url: (st[0] && st[0].target_url) || null };
      } catch { /* deployment state is a nicety */ }
    }));

    const byStory = {};
    for (const issue of issues) {
      const id = (issue.title.match(/^([FT]-\d+)/) || [])[1];
      if (!id) continue;

      // Runs GitHub started for this issue (the action names them after the issue).
      const mine = runs.filter(r => r.display_title === issue.title && r.conclusion !== 'skipped');
      const run = mine[0];

      // The PR Claude's branch ended up in: branch claude/issue-<n>-… or "Closes #<n>".
      const pr = pulls.find(p =>
        (p.head && p.head.ref || '').includes(`issue-${issue.number}-`) ||
        new RegExp(`Closes (yacinebe/Rouedesquiz)?#${issue.number}\\b`).test(p.body || ''));

      const entry = {
        issue: { number: issue.number, title: issue.title, url: issue.html_url, state: issue.state },
        run: run ? { status: run.status, conclusion: run.conclusion, url: run.html_url } : null,
        branch: pr ? pr.head.ref : null,
        pr: pr ? {
          number: pr.number, url: pr.html_url, state: pr.state, merged: !!pr.merged_at,
          mergedAt: pr.merged_at,
          reviewed: (pr.labels || []).some(l => l.name === 'reviewed'),
          mergeSha: pr.merge_commit_sha || null,
          production: pr.merge_commit_sha ? (prodBySha[pr.merge_commit_sha] || null) : null,
        } : null,
        preview: pr ? previews[pr.number] || null : null,
      };
      (byStory[id] = byStory[id] || []).push(entry);
    }

    const data = { byStory, fetchedAt: new Date().toISOString() };
    cache = { at: Date.now(), data };
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
