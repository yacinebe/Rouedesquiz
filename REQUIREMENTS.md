# QuizRoulette — Requirements

A French educational quiz game for ages 5–7 (MS/GS/CP/CE1), built around a spinning theme-wheel. Personal project, fun-first, learning second.

---

## 1. Functional requirements

### 1.1 Decided

- **Language:** French UI throughout (Arabic theme will use Arabic *content* but French chrome).
- **Difficulty levels:** every question carries a difficulty tag. The player picks a level before/after spinning. *Tentative scale:* `facile` (5y / MS–GS) · `moyen` (6y / CP) · `difficile` (7y / CE1) — to be confirmed.
- **Question formats — phased rollout:**
  1. **Phase 1 — Text MCQ** (today's format, expanded).
  2. **Phase 2 — Image-based** (image in question and/or as answer choices: "clique sur le triangle", "quel animal est-ce ?").
  3. **Phase 3 — Sound-based** (audio prompt: read-aloud question for pre-readers, animal sounds, Arabic pronunciation, etc.).
- **Themes (target set):**
  | Theme | Emoji | Notes |
  |---|---|---|
  | Maths | ➕ | existing |
  | Lecture | 📖 | existing |
  | Géographie | 🌍 | existing |
  | Astronomie | 🔭 | existing |
  | Surprise | ⭐ | existing — pulls from all other themes at random |
  | Animaux | 🐾 | new |
  | Arabe | ﺍ | new — Arabic letters / first words |
- **Theme illustrations:** each theme will have a custom picture (provided by the user later) replacing or supplementing the emoji on the wheel and in the category badge.

### 1.2 Open questions

- **Difficulty UX:** is level chosen once at app start (sticky), per spin, or auto-adapted from recent performance?
- **Wheel composition:** current wheel has 10 wedges (5 themes × 2). With 7 themes the cleanest options are 7 wedges (each once) or 14 wedges (each twice). Preference?
- **Surprise behavior:** keep it as "random theme" or make it special (silly questions, jokes, mini-game)?
- **Session length:** stay at 3 questions per spin? Add a "marathon" / "défi" mode?
- **What does "funny" mean?** sound effects, mascot reactions, random blague between questions, unlockable stickers — to be defined.
- **Progression / persistence:** stickers, streaks, best scores per theme? Or fully stateless?
- **Read-aloud (TTS):** auto-read the question for non-readers, or a 🔊 button?

---

## 2. Technical requirements

### 2.1 Decided

- **Question data:** moved out of the HTML into a separate `questions.js` file (or one file per theme under `questions/`). Content authored by the user and pasted in.
- **Hosting:** **Vercel** for public/shareable URL **+ local file** for offline play. App must run from both contexts.
- **Media assets:** dedicated `assets/` folder for theme illustrations, question images, and (later) audio.
- **No build step (for now):** plain HTML/JS/CSS, no bundler, no framework. Reassess if/when needed.
- **No backend.**

### 2.2 Tentative project layout

```
QuizRoulette/
├── index.html              # renamed from quiz-wheel.html for Vercel default
├── questions.js            # all questions, exposed as window.QUESTIONS
├── assets/
│   ├── themes/             # one illustration per theme
│   ├── images/             # question images (Phase 2)
│   └── audio/              # question audio (Phase 3)
├── vercel.json             # if needed for routing/headers
└── REQUIREMENTS.md
```

### 2.3 Question data shape (adopted)

`questions.js` exposes `window.QUIZ_DATA`, an object keyed by theme. Each theme is an array of questions. The current shape per question:

```js
{
  id: 'animaux-001',                      // OPTIONAL: stable filename-safe ID, decouples image paths from question text
  difficulty: 1,                          // 1 = Facile, 2 = Moyen, 3 = Difficile
  question: 'Combien font 5 + 7 ?',
  options: ['10', '11', '12', '13'],
  answer: '12',                           // string match against options[i]
  image: 'assets/images/math/math-001.webp',  // OPTIONAL: illustration above question OR image-as-question
  optionImages: null,                     // OPTIONAL: ['a.webp','b.webp','c.webp','d.webp'] → renders as 2×2 image grid; `options` strings still required as captions/answer keys
  // future fields:
  // audio: 'assets/audio/math/sum-001.mp3',
}
```

**Layout inferred from fields (no `type` field):**
- `optionImages` set → 2×2 image grid for answers
- `image` set + no `optionImages` → image above text question (illustration or image-as-question)
- Neither set → text-only (M1 baseline)

**Failure modes:** missing image files fail silently via `onerror` — image element hides, question still renders.

Top-level structure:

```js
window.QUIZ_DATA = {
  metadata: { difficulty_levels: { 1: 'Facile', 2: 'Moyen', 3: 'Difficile' } },
  math:       [ ... ],
  lecture:    [ ... ],
  geographie: [ ... ],
  astronomie: [ ... ],
  surprise:   [ ... ],
  animaux:    [ ... ],
  arabe:      [ ... ],
};
```

**Schema notes:**
- Theme keys match the wheel segment `cls` values exactly — no translation table.
- `answer` is a **string**, looked up via `options.indexOf(answer)`. Authoring is more readable than indexes.
- `id` and `type` deliberately omitted for now — added later when image/audio questions arrive.

### 2.4 Open questions

- **One file vs many:** single `questions.js` (~simple, fine to a few hundred items) or `questions/<theme>.js` (better for big banks)?
- **Vercel deployment:** any preference between Vercel CLI vs GitHub-connected auto-deploy?
- **Asset format:** SVG (sharp, scalable) vs PNG (easier to source) for theme illustrations?
- **Authoring workflow:** edit `questions.js` by hand, or build a small hidden "/admin" page later to add questions through a form?
- **Tablet vs desktop:** any specific device target? (current CSS is responsive and tap-friendly, which is good.)

---

## 3. Phased roadmap (proposed)

- **M1 — Restructure (DONE):** split `quiz-wheel.html` → `index.html` + `questions.js`, adopted user's schema (`question`/`options`/string-`answer`/numeric `difficulty`), added `animaux` and `arabe` themes with content, kept wheel at 5 themes × 2 wedges (animaux/arabe content authored but not yet on the wheel). Quiz still draws 3 random questions per spin from the larger pool.
- **M1.5 — Vercel deploy:** push to GitHub + connect to Vercel (or `vercel deploy` from CLI). No code change needed.
- **M2 — Difficulty UX:** level selector, filter questions by level. **Blocked on content:** most themes have ~all questions at level 2; need level 1 and level 3 banks filled out before this is useful.
- **M2.5 — Wheel composition:** decide 7 vs 14 wedges and add `animaux` + `arabe` to the wheel.
- **M3 — Theme illustrations:** integrate user-provided pictures on wheel + badges.
- **M4 — Image questions plumbing (DONE):** `index.html` now supports `image` + `optionImages` fields with conditional rendering and graceful fallback. Existing M1 questions unaffected. Visual prototype: `mock-questions.html`.
- **M4.5 — Per-theme content rollout:** scale to 100 questions/theme + author images one theme at a time (Animaux first per the plan). All images from CC0 sources.
- **M5 — Audio questions + read-aloud:** support `type: 'audio'` and optional TTS for text questions.
- **M6 — "Funny" pass:** sound effects, mascot, blagues — scope decided once we agree on the funny direction.
- **M7 — Progression:** stickers / streaks / per-theme best scores in `localStorage`.
