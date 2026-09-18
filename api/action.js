// POST /api/action → the buttons: create an issue, start Claude, send a refinement.
//   { kind: 'issue',   backlog, id, title, brief, trigger:true|false }
//   { kind: 'trigger', issueNumber, text? }
//   { kind: 'refine',  storyId, issueNumber, text }
const { guard, body, gh, repoPath, writeStory } = require('./_lib');

const TEMPLATE_TAIL =
  '\n\nOpen a pull request using .github/pull_request_template.md and link this issue.';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!guard(req, res)) return;
  const p = body(req);

  try {
    if (p.kind === 'issue') {
      if (!p.id || !p.title) return res.status(400).json({ error: 'id and title are required' });
      const brief = (p.brief || '').trim();
      const lead = p.trigger
        ? `@claude implement ${p.id} from BACKLOG_FUNCTIONAL.md\n\n`
        : `Story ${p.id}. (Comment "@claude implement this" to start.)\n\n`;
      const issue = await gh(repoPath('/issues'), {
        method: 'POST',
        body: JSON.stringify({
          title: `${p.id}: ${p.title}`,
          body: lead + brief + (p.trigger ? TEMPLATE_TAIL : ''),
        }),
      });
      if (p.backlog && p.markInProgress !== false) {
        try { await writeStory(p.backlog, p.id, { status: 'In progress' }, `Backlog: ${p.id} in progress (#${issue.number})`); }
        catch { /* the issue exists; a failed status bump shouldn't look like failure */ }
      }
      return res.json({ ok: true, issue: { number: issue.number, url: issue.html_url } });
    }

    if (p.kind === 'trigger') {
      if (!p.issueNumber) return res.status(400).json({ error: 'issueNumber is required' });
      const c = await gh(repoPath(`/issues/${p.issueNumber}/comments`), {
        method: 'POST',
        body: JSON.stringify({ body: (p.text && p.text.trim()) || '@claude implement this issue.' }),
      });
      return res.json({ ok: true, url: c.html_url });
    }

    if (p.kind === 'refine') {
      const text = (p.text || '').trim();
      if (!text) return res.status(400).json({ error: 'text is required' });
      const note = text.startsWith('@claude') ? text : `@claude ${text}`;

      // Where the refinement should land depends on what is still open:
      // an open PR (same branch) → an open issue → otherwise a fresh follow-up issue.
      const pulls = await gh(repoPath('/pulls?state=open&per_page=50'));
      const openPr = p.issueNumber && pulls.find(pr =>
        (pr.head && pr.head.ref || '').includes(`issue-${p.issueNumber}-`) ||
        new RegExp(`Closes (yacinebe/Rouedesquiz)?#${p.issueNumber}\\b`).test(pr.body || ''));

      if (openPr) {
        const c = await gh(repoPath(`/issues/${openPr.number}/comments`), {
          method: 'POST', body: JSON.stringify({ body: note }),
        });
        return res.json({ ok: true, target: 'pr', number: openPr.number, url: c.html_url });
      }

      if (p.issueNumber) {
        const issue = await gh(repoPath(`/issues/${p.issueNumber}`));
        if (issue.state === 'open') {
          const c = await gh(repoPath(`/issues/${p.issueNumber}/comments`), {
            method: 'POST', body: JSON.stringify({ body: note }),
          });
          return res.json({ ok: true, target: 'issue', number: issue.number, url: c.html_url });
        }
      }

      // Everything merged/closed already → a new issue, so Claude branches from main.
      const created = await gh(repoPath('/issues'), {
        method: 'POST',
        body: JSON.stringify({
          title: `${p.storyId || 'Follow-up'}: refinement after testing`,
          body: `${note}\n\nFollow-up${p.issueNumber ? ` to #${p.issueNumber}` : ''}. Branch from current main.${TEMPLATE_TAIL}`,
        }),
      });
      return res.json({ ok: true, target: 'new-issue', number: created.number, url: created.html_url });
    }

    res.status(400).json({ error: `Unknown kind: ${p.kind}` });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
