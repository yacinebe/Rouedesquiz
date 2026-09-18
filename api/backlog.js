// GET  /api/backlog        → every story from both backlog files
// POST /api/backlog        → save one story's fields (commits to main)
const { guard, body, readFile, parseRows, writeStory } = require('./_lib');

module.exports = async (req, res) => {
  if (!guard(req, res)) return;
  try {
    if (req.method === 'POST') {
      const { backlog, id, item, size, priority, depends, status } = body(req);
      if (!backlog || !id) return res.status(400).json({ error: 'backlog and id are required' });
      const saved = await writeStory(backlog, id, { item, size, priority, depends, status },
        `Backlog: update ${id} from the control panel`);
      return res.json({ ok: true, story: saved });
    }

    const out = [];
    for (const which of ['functional', 'technical']) {
      const { text } = await readFile(which);
      out.push(...parseRows(text, which));
    }
    res.json({ stories: out });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
