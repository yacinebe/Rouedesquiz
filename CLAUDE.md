# QuizRoulette — "Roue des Quiz"

French educational quiz game for a child aged 5–7, built around a spinning theme wheel. Personal family project: fun first, learning second. Everything the player sees is **in French**, written for a 5–7 year old (short sentences, simple words, encouraging tone).

## Stack (no build step)

- Plain HTML/CSS/JS, **no bundler, no framework, no npm install**. `index.html` loads ES modules from `src/` and styles from `src/styles/app.css`. External libs come from ESM CDN imports (e.g. `supabase-js` via esm.sh).
- **Supabase** backend (auth, profiles, progress, questions). Config + all data helpers live in [src/db.js](src/db.js). Schema in [supabase/](supabase/) (`schema.sql` + numbered migrations like `002_profiles_fields.sql`).
- **Vercel** hosts the site: `main` → production, every other branch → a Preview deployment (Vercel bot comments the link on the PR).
- Question/sound media are served from a Cloudflare Worker CDN, not from this repo.

## Layout

- `src/main.js` wiring · `wheel.js` wheel canvas · `quiz.js` question flow · `segments.js` the wheel themes (`cls` = theme key) · `auth.js` / `profiles.js` accounts · `progress.js` progress page · `audio.js` sound effects · `ui.js` shared helpers
- `questions.js` — static question bank (`window.QUIZ_DATA`, keyed by theme). The DB `questions` table is seeded from it via `tools/migrate-questions-to-db.js`; `questions.js` is the offline fallback. Data shape documented in [REQUIREMENTS.md](REQUIREMENTS.md) §2.3.
- `BACKLOG_FUNCTIONAL.md` (F-xx) and `BACKLOG_TECHNICAL.md` (T-xx) — the backlogs. `backlog.html` is **generated**: never edit it by hand.

## Autonomous workflow (backlog item → PR)

You'll often be handed a single backlog item (e.g. "do F-32") and expected to work without further input. The user only reviews the PR on the Vercel preview.

1. **Read the item** in the backlog + any items it depends on or supersedes. If a dependency isn't `Done`, say so in the PR and implement what's possible.
2. **Branch** from `main`: `feat/F-32-short-slug` (or `fix/…`, `chore/T-xx-…`). One backlog item per branch/PR. Never commit to `main`.
3. **Open questions → decide, don't stall.** Pick the simplest sensible default that fits a 5–7 year old, and list every such choice under "Decisions I made" in the PR so the user can overrule it.
4. **Implement** matching the existing code style: small ES modules, vanilla DOM, French UI strings, CSS in `app.css` using existing variables.
5. **Verify** before opening the PR: there are no automated tests, so at minimum check the JS parses (`node --check <file>` on each changed module) and reason through the golden path (welcome → sign in → profile → wheel → spin → answer questions → milestone → back). Mention what you verified and how.
6. **Update the backlog**: set the item's Status (`In progress` if partial, `Done` if complete), add a short note of what shipped, then regenerate the view with `node tools/build-backlog-view.js`. Commit both files.
7. **Open the PR** using the template (`.github/pull_request_template.md`), title `F-32: <short description>`.

## Guardrails — stop and hand over to the user

- **Database schema changes:** write a new numbered migration file in `supabase/` (additive, backward-compatible so production keeps working before it's applied) — but **never run it**. Preview deployments share the **production** Supabase project. Put "apply migration X in the Supabase SQL editor" under "Needs you" in the PR.
- **Question content changes** in `questions.js`: the DB copy must be reseeded with `tools/migrate-questions-to-db.js`, which needs a secret key you don't have → list it under "Needs you".
- **Secrets, keys, Vercel/Supabase/Cloudflare settings, uploading media files to the Worker:** never attempt; list under "Needs you".
- Don't add a build step, a package manager, or a framework.
- Don't delete user data or write destructive SQL.
- Content for kids: nothing scary, violent, or inappropriate; facts must be correct.

## Commits

Short imperative summary ending with the backlog ID in parentheses, e.g. `Surprise draws from all themes (F-32)`.
