# QuizRoulette — Technical Backlog

Under-the-hood: architecture, tooling, asset pipeline, deploy, refactors, tech debt. Player-facing work lives in [BACKLOG_FUNCTIONAL.md](BACKLOG_FUNCTIONAL.md).

> **Strategic note — v2 pivot.** `T-03` (backend) is the keystone: `#1` LLM generation, `#2` profiles/leaderboard, `#4` cloud STT, and `#8` multiplayer all require it. Adopting it retires the founding guardrails *no backend · no build step · runs offline from `file://`*. Some legacy items below (`T-11`, `T-16`, `T-17`) only matter if we keep a static bank as a fallback.

**Legend**
- **Size (T-shirt):** `S` <2h · `M` ~half-day · `L` multi-day · `XL` multi-session, split before starting.
- **Priority:** `High` do next / foundational · `Med` important soon · `Low` later / vision.
- **Status:** `Todo` · `In progress` · `Blocked` · `Done`.

## Backlog

| ID | Item — what & why | Size | Priority | Depends on | Status |
|----|-------------------|:----:|:--------:|-----------|:------:|
| T-01 | **Delete / archive the twin repo** — `yacinebe/rouedesquizz` (double-z) is a stale duplicate that made Vercel deploy old code. Remove it. 2-min cleanup. | S | High | — | Todo |
| T-02 | **Centralize the image base URL** — `questions.js` hard-codes 910 absolute CDN URLs; store the base once so switching hosts / local fallback is one line. | M | High | — | Todo |
| T-03 | **Backend + API (the pivot)** — ~~introduce a server/API~~ **Supabase** (Postgres + auth + RLS); browser talks to it directly, no server code. Keystone that unblocks accounts, progress, and later generation. Shipped + deployed. *(idea #5)* | XL | High | strategic decision | Done |
| T-04 | **Choose hosting platform** — ✅ **Decided:** front-end stays on Vercel, data/auth on **Supabase** (free tier; $0 ongoing at family scale). Provisioned via Vercel Marketplace (`supabase-cerulean-flame`). *(idea #6)* | S | High | T-03 | Done |
| T-05 | **Accounts & identity (auth)** — **anonymous auth + per-child profiles shipped** (device-scoped, upgradeable to real accounts later for cross-device sync). *(idea #2 base)* | L | High | T-03 | Done |
| T-07 | **LLM content safety & human review** — ⚠️ validate correctness + a parent-approval/block path before generated content reaches a 5-year-old. Non-negotiable prerequisite for F-20. *(my idea X-b)* | L | High | T-08 | Todo |
| T-08 | **LLM generation engine + cost control & caching** — generate questions/images via LLM (the machinery behind F-20); generate → validate → cache into a bank rather than calling the model every play. Keeps cost/latency low, preserves offline fallback. *(idea #1 engine + my idea X-c)* | L | High | T-03 | Todo |
| T-09 | **Open-answer grading service** — judge free-form answers (fuzzy "douze"≈"12" or LLM judge). Shared by voice answering & advanced mode. *(my idea X-d)* | M | Med | T-03 | Todo |
| T-10 | **Speech-to-text integration** — cloud STT for spoken answers (browser STT is online-only & weak in FR). *(supports #4)* | M | Med | T-03 | Todo |
| T-11 | **questions.js validation check** — script: answer ∈ options, unique IDs, `optionImages` length, image paths. Run before deploy. | M | Med | — | Todo |
| T-12 | **Kids' privacy & data compliance** — minimal data, parent-controlled, no ad tracking (COPPA/GDPR-K) for a minor's scores/voice. *(my idea X-e)* | M | Med | T-05 | Todo |
| T-13 | **Image licensing / appropriateness check** — vet scraped/generated images for license + kid-appropriateness. *(my idea X-f)* | S | Med | T-06 | Todo |
| T-14 | **CI/CD + secrets/env management** — pipeline + secure API-key handling once a backend & keys exist. | M | Med | T-03 | Todo |
| T-15 | **Audio asset pipeline & schema** — `assets/audio/`, `audio` field, fetch/naming convention. Enables audio-prompt questions (F-18). | M | Low | — | Todo |
| T-16 | **Convert images to WebP** — smaller payloads / faster loads; cheap once T-02 lands. | M | Low | T-02 | Todo |
| T-17 | **One-file vs per-theme question files** — split `questions.js` as it grows (moot if content moves to a DB). | S | Low | — | Todo |
| T-18 | **vercel.json cache headers** — long-cache immutable assets, no-cache HTML (only if front-end stays on Vercel). | S | Low | — | Todo |
| T-19 | **Retire `questions.js` — single source of truth** — the DB is now a cache seeded from `questions.js`; two copies of the content is undesirable. Once the DB is authoritative (an authoring path that isn't this file) and offline/`file://` play is dropped or served another way, delete the static bank + its fallback in `index.html`. *(user: dislikes dual source of truth)* | M | Med | authoring path (T-08 / admin UI) + offline decision | Todo |
| T-27 | **Modularize the front-end** — split the monolithic `index.html` into ES modules under `src/` (`main` / `wheel` / `quiz` / `profiles` / `progress` + existing `db`), move inline CSS to `src/styles/app.css`, replace inline `onclick=""` with `addEventListener`, and remove the classic-script ↔ module `window.QuizDB` bridge. Pure refactor, no behaviour change. Do before piling on leaderboard/sounds/i18n. Trade-off: full-ESM ends `file://` play (already on http/Vercel). | M | High | — | Done |
| T-26 | **Device-independent accounts** — account-first gate: welcome (sign in / sign up) → the account's profiles. **Each account is a family** (family name captured at sign-up, shown Netflix-style over the profiles). **Email + password** (Supabase Auth) with a show-password toggle and a forgot-password reset flow; sign out returns to welcome. Cross-device by design; anonymous/guest play dropped. Config: Confirm-email OFF (or redirect URLs + SMTP for confirm/reset emails). Unblocks a trustworthy F-16 leaderboard, cross-device F-06, and F-17. | L | Med | T-05 | Done |
| T-28 | **Custom SMTP for auth emails** — replace Supabase's built-in mailer (rate-limited, spam-prone) with custom SMTP (e.g. Resend free tier) so confirmation / password-reset emails deliver reliably and the sender reads **La Roue des Quiz**. Config-only: create SMTP creds → Supabase → Auth → SMTP Settings (host/port/user/pass + sender name) → brand the email templates. | S | Med | T-26 | Todo |
| T-29 | **Installable app on the kids' device (no store)** — package the existing web app so it lives on the home screen and runs fullscreen, without any App/Play Store submission. Path: turn it into a **PWA** — add `manifest.webmanifest` (name, icons, `display:standalone`, theme colours) + a minimal service worker (offline shell + cache the app + `questions.js` fallback), then "Add to Home Screen" on the tablet. Reuses 100% of the current code (Supabase + game logic + UI) — no rewrite. Trade-off: not store-listed, iOS PWA quirks, limited native APIs. Good-enough "it's an app" for family use. *(the recent T-27 modularization already helps)* | M | Med | T-27 | Todo |
| T-30 | **App Store–grade native app** — a real, store-distributable iOS/Android app. Two routes: **(a) Capacitor** — wrap the current web app in a native WebView shell, ship to both stores in ~1–2 days, keep ~all code (cheapest route to a store listing + native APIs / push); **(b) React Native** — true native rewrite of the *view layer* only (screens → RN components, CSS → StyleSheet, the **canvas wheel → react-native-skia + Reanimated** — the one hard piece), reusing Supabase (`supabase-js` + AsyncStorage session) and the plain-JS game logic. Days→~2 weeks for genuine native feel/perf. Also needs: store accounts (Apple $99/yr + Google $25 one-off), icons/splash, privacy labels (ties to T-12), and confirming the Supabase auth redirect/deep-link flow works in-app. Decide route by goal: store listing + minimal work → Capacitor; native feel/features → React Native. *(Flutter deliberately excluded — nothing reuses, logic re-ported to Dart)* | XL | Low | T-27, T-29 | Todo |
| T-20 | **Split `quiz-wheel.html` → `index.html` + `questions.js`** — questions exposed as `window.QUIZ_DATA`, loadable with no build step. | — | — | — | Done |
| T-21 | **No-build vanilla HTML/JS/CSS** — runs from `file://` and Vercel `https`; no bundler, no framework. | — | — | — | Done |
| T-22 | **Image plumbing** — `image` / `optionImages` fields with conditional layout + graceful `onerror` hide. | — | — | — | Done |
| T-23 | **Question images on a Cloudflare Worker CDN** — migrated to `quiz-images.…workers.dev`. | — | — | — | Done |
| T-24 | **Per-theme idempotent image-fetch scripts** — `tools/fetch-<theme>.ps1`, re-runnable. | — | — | — | Done |
| T-25 | **Vercel deploy via GitHub auto-deploy** — repointed from the wrong twin repo; auto-deploy from `main` confirmed. | — | — | — | Done |

> **Superseded / folded:** the old "authoring/admin page" idea is absorbed by T-06 (generation) + T-07 (review UI). `T-02` (missing-image upload) is folded into F-08 / T-06.
