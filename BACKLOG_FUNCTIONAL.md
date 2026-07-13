# QuizRoulette — Functional Backlog

Player-facing behavior & content. Under-the-hood work lives in [BACKLOG_TECHNICAL.md](BACKLOG_TECHNICAL.md).

> **Strategic note — v2 pivot.** The project is moving from a personal *static* toy to a *connected app*. Several items below depend on a backend + accounts (see Technical `T-03`, `T-05`). This retires the original "no backend / no build / offline `file://`" guardrails — a deliberate choice to be ratified in REQUIREMENTS.md.

**Legend**
- **Size (T-shirt):** `S` <2h · `M` ~half-day · `L` multi-day · `XL` multi-session, split before starting.
- **Priority:** `High` do next / foundational · `Med` important soon · `Low` later / vision.
- **Status:** `Todo` · `In progress` · `Blocked` · `Done`.

## Backlog

| ID | Item — what & why | Size | Priority | Depends on | Status |
|----|-------------------|:----:|:--------:|-----------|:------:|
| F-01 | **Read-aloud (TTS)** — voice reads the question (and options) aloud for pre-readers, auto or 🔊 button. Browser `speechSynthesis`, no backend. *(idea #3)* | M | High | — | Todo |
| F-02 | **Difficulty UX decision** — sticky vs per-spin vs adaptive. Unblocks the difficulty feature. | S | High | — | Todo |
| F-03 | **Difficulty selector + filter** — pick a level; quiz draws only matching questions. Data already tagged. | M | High | F-02, F-04 | Todo |
| F-04 | **Fill facile & difficile banks** — most content is `moyen`; author level-1 & level-3 so difficulty is meaningful. *(may be served by LLM gen, F-20)* | L | High | — | Todo |
| F-05 | **Celebration moments** — confetti + sound on streaks / perfect round. Cheap, big joy. | S | High | — | Todo |
| F-20 | **Dynamic / endless questions** — questions (and images) generated on demand by an LLM instead of the fixed static list, so content feels fresh and never runs out. *(idea #1; engine/safety/cost work in T-07/T-08, image licensing T-13)* | L | High | T-03, T-07, T-08 | Todo |
| F-06 | **Parent dashboard** — a view for you: progress, frequent mistakes, set/lock difficulty & themes. *(my idea D-a)* | M | Med | F-10 | Todo |
| F-07 | **Mascot companion** — a character that reacts (cheers, "essaie encore"); the concrete form of the old "funny pass". *(my idea D-b)* | M | Med | — | Todo |
| F-08 | **Finish question images** — 118 / 910 referenced images don't exist yet; source or generate them. | M | Med | — | Todo |
| F-09 | **Theme illustrations** — custom picture per theme on the wheel wedge + category badge. | M | Med | user art | Todo |
| F-10 | **Player profile + progress** — per-theme best scores, streaks, history that persists. Profiles + durable per-question/per-session logging shipped; per-theme record shown on the score screen. *(idea #2, absorbs old F-06)* | M | Med | T-05 | In progress |
| F-11 | **Rewards, stickers & avatar** — collectibles/avatar earned by playing; return-driver for a 5-year-old. *(my idea D-c)* | M | Med | F-10 | Todo |
| F-12 | **Adaptive difficulty** — auto-nudge level from recent performance. *(my idea D-d)* | M | Low | F-03 | Todo |
| F-13 | **Voice answering** — child speaks the answer; STT interprets & checks it. Hands-free with F-01. *(idea #4)* | L | Low | T-09, T-10 | Todo |
| F-14 | **Advanced (open-ended) mode** — pick a theme → harder question with no multiple-choice options. *(idea #7)* | M | Low | F-20, T-09 | Todo |
| F-15 | **Session modes** — beyond 3/spin: a longer "marathon" or timed "défi". | M | Low | — | Todo |
| F-16 | **Leaderboard** — compare scores across players. *(idea #2)* | M | Low | F-10, T-05 | Todo |
| F-17 | **Multiplayer / contest** — play with friends; async (compare later) or real-time head-to-head. *(idea #8)* | XL | Low | F-16, T-03, T-05 | Todo |
| F-18 | **Audio-prompt questions** — sound *is* the prompt (animal sounds, Arabic pronunciation). | L | Low | T-15 | Todo |
| F-19 | **Surprise theme special behavior** — keep "random theme" or make it silly/jokes/mini-game. | M | Low | — | Todo |
| F-27 | **Translate everything to English** — full i18n: language toggle + translated UI chrome + English question content. This first translation establishes the i18n plumbing (string catalog + per-language question sets). *(the ~700 questions are the bulk of the effort)* | L | Med | — | Todo |
| F-28 | **Translate everything to Arabic** — Arabic UI + question content, **plus right-to-left (RTL) layout**. Reuses F-27's i18n plumbing. (Distinct from the existing `Arabe` learning theme, which teaches Arabic letters/words within the French app.) | L | Med | F-27 | Todo |
| F-29 | **Funny sound & music** — playful kid audio for key moments: intro/menu, correct answer, wrong answer, win/perfect, lose/encourage; plus a mute toggle. Absorbs the "sound" half of F-05. | M | High | — | Todo |
| F-21 | **7-theme spinning wheel** — Maths, Lecture, Géographie, Astronomie, Animaux, Arabe, Surprise; one wedge each. | — | — | — | Done |
| F-22 | **Click a wheel slice to select a theme** — direct pick, no spin. | — | — | — | Done |
| F-23 | **3 questions per spin + score screen** — end-of-session score with emoji feedback. | — | — | — | Done |
| F-24 | **Text MCQ + image question formats** — illustration, image-as-question, 2×2 image-option grid. | — | — | — | Done |
| F-25 | **700 questions across 7 themes** — ≈175 facile / 350 moyen / 175 difficile. | — | — | — | Done |
| F-26 | **792 / 910 question images sourced** — French Wikipedia, graceful hide-on-missing. | — | — | — | Done |
