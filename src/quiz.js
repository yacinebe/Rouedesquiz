// Quiz loop: endless run per theme (or a finite "revise mistakes" replay),
// with a milestone every 10 questions.
import { showScreen, launchConfetti, shuffle, unicornSVG } from './ui.js';
import { fetchQuestions, logAttempt, logSession } from './db.js';
import { getProfileId } from './profiles.js';
import { SEGMENTS } from './segments.js';
import { initTts, isTtsSupported, isTtsEnabled, setTtsEnabled, speakParts, stopSpeaking } from './tts.js';
import { generateChessQuestion, renderChessBoardHTML } from './chess.js';

// Surprise draws from every other theme, in equal shares — each question
// keeps a tag back to its real theme so it can still be shown/answered correctly.
// merveilleux is deliberately not in SEGMENTS (see below), so it's naturally
// excluded from this mix too.
const SURPRISE_SOURCES = SEGMENTS.filter(s => s.cls !== 'surprise');

const MILESTONE = 10;                 // questions per milestone
let queue = [];                       // upcoming questions this run
let poolCache = [];                   // full pool, to reshuffle in endless mode
let currentQ = null;
let runScore = 0, runCount = 0;       // this run: correct answers / questions answered
let blockResults = [];                // correctness for the current block of 10
let answered = false;
let endless = true;                   // false during "revise mistakes" replay
let runTheme = null, runColor = '#FFE66D', runLabel = '';
let runLogged = false;

// ── Mode Merveilleux (F-31): a bonus theme unlocked by a 10-answer streak. ──
// Not a wheel wedge (kept out of SEGMENTS on purpose — it's entered via a
// button next to the wheel instead, so the 7-slice wheel geometry and the
// Surprise mix stay untouched). Streak + unlock are session-only (in memory,
// lost on reload/sign-out) — no database change. The unlock is spent once
// played (F-37): leaving a Merveilleux run relocks it, so it stays a reward
// rather than a permanent shortcut — see relockMerveilleux()/goToWheel().
const STREAK_TARGET = 10;
const MERVEILLEUX_SEG = { label: 'Merveilleux', emoji: '🦄', color: '#FF9BEE', cls: 'merveilleux' };
let sessionStreak = 0;
let merveilleuxUnlocked = false;

// ── Mode Échecs (F-48, phase 1) ─────────────────────────────────
// Also not a wheel wedge, for the same reason as Merveilleux: the wheel
// geometry (ARC, wedge count) is computed from SEGMENTS.length in
// wheel.js, so an 8th wedge would shrink every existing slice instead of
// just adding one. Entered via a persistent button next to the wheel
// instead (always visible — unlike Merveilleux this isn't a reward).
// Kept out of SEGMENTS, so it's automatically excluded from the Surprise
// mix too (SURPRISE_SOURCES filters SEGMENTS) — a chess question has no
// "origin theme" meaning there. Questions are generated on the fly (see
// chess.js), never drawn from a fixed pool — see drawNext().
const ECHECS_SEG = { label: 'Échecs', emoji: '♞', color: '#C48A5A', cls: 'echecs' };

export async function startQuiz(seg) {
  if (!seg) return;
  if (seg.cls === 'echecs') {
    beginRun({ theme: 'echecs', label: seg.label, color: seg.color,
               emoji: seg.emoji, cls: 'echecs', pool: [], endless: true });
    return;
  }
  const pool = seg.cls === 'surprise' ? await buildSurprisePool() : await fetchThemePool(seg.cls);
  if (!pool || pool.length === 0) {
    document.getElementById('resultArea').innerHTML =
      `<div class="result-card ${seg.cls}"><div class="rc-top"><span>Aucune question pour ce thème 😅</span></div></div>`;
    return;
  }
  beginRun({ theme: seg.cls, label: seg.label, color: seg.color,
             emoji: seg.emoji, cls: seg.cls, pool, endless: true });
}

// DB first (Supabase), fall back to the static questions.js bank (offline-safe).
async function fetchThemePool(cls) {
  let pool = await fetchQuestions(cls);
  if (!pool || pool.length === 0) {
    pool = (window.QUIZ_DATA && window.QUIZ_DATA[cls]) || [];
  }
  return pool;
}

// Mix & match from the 6 other themes (equal share each), tagging every
// question with its real origin theme so it can still be shown & scored.
async function buildSurprisePool() {
  const pools = await Promise.all(SURPRISE_SOURCES.map(async src => {
    const pool = await fetchThemePool(src.cls);
    return pool.map(q => ({ ...q, origin: src }));
  }));
  return pools.flat();
}

// Start a run: an endless theme run, or a finite "revise mistakes" replay.
export function beginRun({ theme, label, color, emoji, cls, pool, endless: isEndless }) {
  runTheme = theme; runColor = color; runLabel = label; endless = isEndless;
  poolCache = pool.slice();
  queue = shuffle(pool.slice());
  runScore = 0; runCount = 0; blockResults = []; runLogged = false;

  const badge = document.getElementById('catBadge');
  badge.textContent = `${emoji} ${label}`;
  badge.className = 'quiz-cat-badge ' + cls;
  badge.style.color = color;
  badge.style.borderColor = color;
  document.getElementById('quizScreen').classList.toggle('merveilleux-mode', cls === 'merveilleux');

  setBadgeScore();
  showScreen('quizScreen');
  currentQ = drawNext();
  renderQuestion();
}

function drawNext() {
  // Echecs never draws from a pool — every question is freshly generated.
  if (runTheme === 'echecs') return generateChessQuestion();
  if (!queue.length) {
    if (endless) queue = shuffle(poolCache.slice());
    else return null;                 // finite run exhausted
  }
  return queue.shift();
}

// Live score (+ streak, subtly) shown under the player's name (top-right badge).
function setBadgeScore() {
  const el = document.querySelector('#currentPlayer .cp-score');
  if (!el) return;
  const parts = [];
  if (runCount) parts.push(`⭐ ${runScore}/${runCount}`);
  if (sessionStreak > 0) parts.push(`🔥 ${sessionStreak}`);
  el.textContent = parts.join('  ');
}

// F-01: what gets read aloud — the question, then each option prefixed by
// its letter so a pre-reader can still tell them apart when picking.
// F-43 refinement (#20): Arabe questions are now fully Arabic text, so
// they're read entirely with an Arabic voice/lang — labels included —
// instead of only the embedded word.
function isArabeQuestion(q) {
  return !!q && (runTheme === 'arabe' || (q.origin && q.origin.cls === 'arabe'));
}

// Emoji have no spoken form in Arabic (or any language) — an Arabic voice
// asked to read one tends to stumble/garble, so strip it before speaking.
function stripEmojiForSpeech(text) {
  return text.replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim();
}

// F-43 follow-up (#24): a bare Arabic consonant read on its own (e.g. one of
// the alphabet-quiz answer letters) has no vowel to say, so speech engines
// either read out its *name* or garble it — noticeably "weird" to a 5-7yo.
// Appending a fatha turns it into a spoken consonant+vowel syllable ("ba",
// "ta"...), the trick Arabic phonics apps use to teach letter sounds. Alif
// is skipped: it's a vowel letter already, pronounceable on its own. This
// only affects what's *spoken* — the displayed letter is never touched, on
// purpose, so a single-letter answer still shows as the plain letter.
const FATHA = '\u064E';
const ARABIC_CONSONANTS = 'بتثجحخدذرزسشصضطظعغفقكلمنهوي';
const BOUNDARY = '\\s«»"\'.,؟!:';
const soloArabicLetterRe = new RegExp(
  `(^|[${BOUNDARY}])([${ARABIC_CONSONANTS}])(?=$|[${BOUNDARY}])`, 'gu'
);
function vocalizeSoloLettersForSpeech(text) {
  return text.replace(soloArabicLetterRe, (m, before, letter) => `${before}${letter}${FATHA}`);
}

function speechPartsForQuestion(q) {
  if (!q) return [];
  if (isArabeQuestion(q)) {
    // One utterance per sentence (question, then each option) instead of a
    // single long combined string: browsers' speechSynthesis is known to
    // stall/cut off on long utterances, which sounded "choppy"/garbled —
    // short back-to-back utterances play far more reliably and give the
    // question and each option a clean pause between them.
    // F-43 refinement (#22): no letter label at all — just speak the option
    // text itself, simpler for a 5-7yo to follow than "alif: <option>".
    const prep = (t) => vocalizeSoloLettersForSpeech(stripEmojiForSpeech(t));
    const parts = [{ text: prep(q.question), lang: 'ar' }];
    q.options.forEach((o) => {
      parts.push({ text: `${prep(o)}.`, lang: 'ar' });
    });
    return parts;
  }
  const letters = ['A', 'B', 'C', 'D'];
  const opts = q.options.map((o, i) => `Réponse ${letters[i]} : ${o}.`).join(' ');
  return [{ text: `${q.question} ${opts}`, lang: 'fr' }];
}

function renderQuestion() {
  answered = false;
  const q = currentQ;
  if (!q) { runComplete(); return; }
  const letters = ['A', 'B', 'C', 'D'];
  const posInBlock = runCount % MILESTONE;   // answered so far in the current block

  document.getElementById('questionNum').textContent = `Question ${runCount + 1}`;
  const questionTextEl = document.getElementById('questionText');
  questionTextEl.textContent = q.question;
  // F-43 refinement (#20): Arabe questions are now fully Arabic text — display them right-to-left.
  questionTextEl.dir = isArabeQuestion(q) ? 'rtl' : 'ltr';
  questionTextEl.lang = isArabeQuestion(q) ? 'ar' : 'fr';

  // Surprise mode: tag each question with the real theme it was drawn from.
  const originEl = document.getElementById('questionOrigin');
  if (q.origin) {
    originEl.textContent = `${q.origin.emoji} ${q.origin.label}`;
    originEl.className = 'question-origin ' + q.origin.cls;
    originEl.style.display = '';
  } else {
    originEl.style.display = 'none';
  }

  // Question image (illustration / image-as-question) or, for Échecs, the
  // read-only chess board illustrating the single piece being asked about.
  const imgWrap = document.getElementById('questionImageWrap');
  imgWrap.classList.toggle('chess-board-wrap', !!q.board);
  if (q.board) {
    imgWrap.innerHTML = renderChessBoardHTML(q.board.from, q.board.symbol, q.options);
    imgWrap.style.display = '';
  } else if (q.image) {
    imgWrap.innerHTML = `<img src="${q.image}" alt="" onerror="this.parentElement.style.display='none'">`;
    imgWrap.style.display = '';
  } else {
    imgWrap.innerHTML = '';
    imgWrap.style.display = 'none';
  }

  // Progress dots — the current block of 10 (toward the next milestone)
  const dots = document.getElementById('progressDots');
  dots.innerHTML = '';
  for (let i = 0; i < MILESTONE; i++) {
    let cls = 'dot';
    if (i < blockResults.length) cls += blockResults[i] ? ' done' : ' wrong';
    else if (i === posInBlock) cls += ' current';
    const d = document.createElement('div');
    d.className = cls;
    dots.appendChild(d);
  }

  // Choices — image grid if optionImages set, otherwise text buttons
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  choicesEl.dir = isArabeQuestion(q) ? 'rtl' : 'ltr';
  choicesEl.lang = isArabeQuestion(q) ? 'ar' : 'fr';
  if (q.optionImages) {
    choicesEl.classList.add('grid');
    q.optionImages.forEach((src, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn img';
      btn.innerHTML =
        `<div class="img-wrap"><img src="${src}" alt="${q.options[i]}" onerror="this.style.display='none'"></div>` +
        `<span class="cap">${q.options[i]}</span>`;
      btn.addEventListener('click', () => selectAnswer(i));
      choicesEl.appendChild(btn);
    });
  } else {
    choicesEl.classList.remove('grid');
    q.options.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span>${c}`;
      btn.addEventListener('click', () => selectAnswer(i));
      choicesEl.appendChild(btn);
    });
  }

  // Reset feedback & next
  const fb = document.getElementById('feedback');
  fb.className = 'feedback';
  fb.textContent = '';

  const nb = document.getElementById('nextBtn');
  nb.className = 'next-btn';
  nb.textContent = ((runCount + 1) % MILESTONE === 0) ? 'Palier ! 🎉' : 'Question suivante →';

  // Animate card
  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';

  if (isTtsSupported() && isTtsEnabled()) speakParts(speechPartsForQuestion(q));
}

function selectAnswer(chosen) {
  if (answered) return;
  answered = true;
  const q = currentQ;
  const correctIdx = q.options.indexOf(q.answer);
  const btns = document.querySelectorAll('.choice-btn');

  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIdx) btn.classList.add('correct');
    else if (i === chosen) btn.classList.add('wrong');
  });

  const isCorrect = chosen === correctIdx;
  if (isCorrect) runScore++;
  runCount++;
  blockResults.push(isCorrect);

  // Streak: consecutive correct answers across the whole session (endless
  // runs only — "revise mistakes" replays don't count). A wrong answer
  // resets it to 0; reaching the target unlocks Mode Merveilleux once.
  if (endless) {
    if (isCorrect) {
      sessionStreak++;
      if (sessionStreak >= STREAK_TARGET && !merveilleuxUnlocked) {
        merveilleuxUnlocked = true;
        unlockMerveilleux();
      }
    } else {
      sessionStreak = 0;
    }
  }

  if (isCorrect && runTheme === 'merveilleux') pulseMerveilleuxScene();

  // Record the attempt (fire-and-forget; no-ops for guests / offline)
  logAttempt({
    profile_id: getProfileId(),
    question_id: q.db_id || null,
    theme: runTheme,
    difficulty: q.difficulty ?? null,
    is_correct: isCorrect
  });
  setBadgeScore();

  const fb = document.getElementById('feedback');
  fb.className = 'feedback show ' + (isCorrect ? 'correct' : 'wrong');
  fb.textContent = isCorrect ? '✅ Bravo, c\'est la bonne réponse !' : `❌ La bonne réponse était : ${q.answer}`;

  // Update the dot we just answered
  const dots = document.getElementById('progressDots');
  const idx = (runCount - 1) % MILESTONE;
  if (dots.children[idx]) dots.children[idx].className = 'dot ' + (isCorrect ? 'done' : 'wrong');

  // Preload next question's image (if any) — silent on failure
  if (queue[0] && queue[0].image) new Image().src = queue[0].image;

  document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion() {
  // Milestone every 10 answered questions.
  if (runCount > 0 && runCount % MILESTONE === 0) { showMilestone(); return; }
  currentQ = drawNext();
  if (!currentQ) { runComplete(); return; }
  renderQuestion();
}

function milestoneEmoji(s, total) {
  return s >= total * 0.8 ? '🏆' : s >= total * 0.5 ? '🎉' : '💪';
}

function showMilestone() {
  stopSpeaking();
  document.getElementById('msContinue').style.display = '';
  document.getElementById('msEmoji').textContent = milestoneEmoji(runScore, runCount);
  document.getElementById('msTitle').textContent = `Palier ${runCount / MILESTONE} atteint !`;
  document.getElementById('msNum').textContent = `${runScore} / ${runCount}`;
  document.getElementById('msNum').style.color = runColor;
  document.getElementById('msSub').textContent = 'bonnes réponses';
  showScreen('milestoneScreen');
  launchConfetti(runColor);
}

function continueRun() {
  blockResults = [];
  currentQ = drawNext();
  if (!currentQ) { runComplete(); return; }
  showScreen('quizScreen');
  renderQuestion();
}

// A finite run ("revise mistakes") has no more questions.
function runComplete() {
  stopSpeaking();
  finalizeRun();
  document.getElementById('msContinue').style.display = 'none';
  document.getElementById('msEmoji').textContent = '🎯';
  document.getElementById('msTitle').textContent = 'Révision terminée !';
  document.getElementById('msNum').textContent = `${runScore} / ${runCount}`;
  document.getElementById('msNum').style.color = runColor;
  document.getElementById('msSub').textContent = 'bonnes réponses';
  showScreen('milestoneScreen');
  launchConfetti(runColor);
}

// Log the run once (to sessions) when leaving it.
function finalizeRun() {
  if (runLogged) return;
  runLogged = true;
  const pid = getProfileId();
  if (pid && runCount > 0) {
    logSession({ profile_id: pid, theme: runTheme, score: runScore, total: runCount });
  }
}

export function goToWheel() {
  stopSpeaking();
  finalizeRun();
  // F-37: the unlock is a one-play reward, not a permanent shortcut — leaving
  // a Merveilleux run (any "back to wheel" control) locks it again, so she
  // has to earn a fresh 10-streak. The secret cheat is untouched: it forces
  // merveilleuxUnlocked back to true on demand, regardless of this reset.
  if (runTheme === 'merveilleux') relockMerveilleux();
  showScreen('wheelScreen');
}

function relockMerveilleux() {
  merveilleuxUnlocked = false;
  sessionStreak = 0;
  const btn = document.getElementById('mvEntryBtn');
  if (btn) btn.style.display = 'none';
}

// ── Mode Merveilleux unlock (F-31) ──────────────────────────────
function showMerveilleuxEntry() {
  const btn = document.getElementById('mvEntryBtn');
  if (btn) btn.style.display = '';
}

function unlockMerveilleux() {
  showMerveilleuxEntry();
  document.getElementById('mvPopup').style.display = 'flex';
  launchConfetti(MERVEILLEUX_SEG.color);
}

function closeMerveilleuxPopup() {
  document.getElementById('mvPopup').style.display = 'none';
}

// F-35: brief flourish across the galloping-unicorn scene when a Merveilleux
// answer is correct — a flash on both unicorns (removed again after the
// animation so it can re-trigger next time).
function pulseMerveilleuxScene() {
  const el = document.getElementById('mvScene');
  if (!el) return;
  el.classList.remove('leap');
  void el.offsetWidth; // reflow, so re-adding the class restarts the animation
  el.classList.add('leap');
  setTimeout(() => el.classList.remove('leap'), 650);
}

// Jump straight into Mode Merveilleux (from the popup's "Jouer maintenant"
// or the wheel-screen entry button once unlocked). Finalizes whatever run
// was in progress first, same as leaving via "Retour à la roue".
function playMerveilleuxNow() {
  finalizeRun();
  closeMerveilleuxPopup();
  startQuiz(MERVEILLEUX_SEG);
}

// Dev/testing shortcut: ?streak=9 forces the session streak, so the unlock
// can be tested with a single correct answer. Read fresh each time (instead
// of once at load) so it survives resetPlaySession() resets too.
function forcedStreakFromURL() {
  const raw = new URLSearchParams(location.search).get('streak');
  const n = Number(raw);
  return (raw !== null && Number.isFinite(n) && n >= 0) ? n : null;
}

// ── Secret parent/dev shortcut into Mode Merveilleux (F-31 follow-up) ──────
// Unlocks (same end state as earning the 10-streak — the 🦄 entry button
// stays visible afterwards) and jumps straight into a Merveilleux run, in
// one go. Deliberately undocumented in the UI — a hidden cheat, not a
// feature — so it must never leave a visible hint or trigger by accident.
// Session-only, like the real unlock: resetPlaySession() (sign-out/in,
// profile switch) clears merveilleuxUnlocked the same way either path does.
function activateMerveilleuxCheat() {
  merveilleuxUnlocked = true;
  showMerveilleuxEntry();
  playMerveilleuxNow();
}

const CHEAT_WORD = 'licorne';
let cheatBuffer = '';
let cheatBufferTimer = null;

// True while the user is typing into a real form field — the sign-in /
// sign-up / profile forms all use plain <input>s, so this alone is enough
// to keep the cheat from ever firing while a parent or kid is typing there.
function isTypingInField(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

function onCheatKeydown(e) {
  if (isTypingInField(document.activeElement)) return;

  if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    activateMerveilleuxCheat();
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;   // don't let other shortcuts pollute the buffer

  if (!/^[a-z]$/i.test(e.key)) return;
  clearTimeout(cheatBufferTimer);
  cheatBuffer = (cheatBuffer + e.key.toLowerCase()).slice(-CHEAT_WORD.length);
  cheatBufferTimer = setTimeout(() => { cheatBuffer = ''; }, 2000);
  if (cheatBuffer === CHEAT_WORD) {
    cheatBuffer = '';
    activateMerveilleuxCheat();
  }
}

// Touch equivalent (no keyboard on phone/tablet, the main device): 5 quick
// taps on the wheel screen title within ~2s.
let titleTapCount = 0;
let titleTapTimer = null;

function onWheelTitleTap() {
  titleTapCount++;
  clearTimeout(titleTapTimer);
  titleTapTimer = setTimeout(() => { titleTapCount = 0; }, 2000);
  if (titleTapCount >= 5) {
    titleTapCount = 0;
    activateMerveilleuxCheat();
  }
}

// Reset the in-memory session state (streak + unlock) — Mode Merveilleux is
// a per-session reward, never persisted, so every new session starts locked
// again. Called on sign-out, sign-in and profile switch (a page reload
// resets it for free, since these are plain module-level variables).
export function resetPlaySession() {
  sessionStreak = forcedStreakFromURL() ?? 0;
  merveilleuxUnlocked = false;
  closeMerveilleuxPopup();
  const btn = document.getElementById('mvEntryBtn');
  if (btn) btn.style.display = 'none';
}

// F-01: 🔊 replays the current question on demand; the toggle switches
// auto-read on/off (remembered across visits — this device only, no DB).
function updateTtsToggleUI() {
  const btn = document.getElementById('ttsToggleBtn');
  if (!btn) return;
  const on = isTtsEnabled();
  btn.textContent = on ? '🔊' : '🔇';
  btn.classList.toggle('off', !on);
  btn.title = on ? 'Lecture automatique activée (appuie pour désactiver)' : 'Lecture automatique désactivée (appuie pour activer)';
}

function initTtsControls() {
  const replayBtn = document.getElementById('ttsReplayBtn');
  const toggleBtn = document.getElementById('ttsToggleBtn');
  if (!isTtsSupported()) {
    if (replayBtn) replayBtn.style.display = 'none';
    if (toggleBtn) toggleBtn.style.display = 'none';
    return;
  }
  initTts();
  replayBtn.addEventListener('click', () => speakParts(speechPartsForQuestion(currentQ)));
  toggleBtn.addEventListener('click', () => {
    setTtsEnabled(!isTtsEnabled());
    updateTtsToggleUI();
    if (!isTtsEnabled()) stopSpeaking();
  });
  updateTtsToggleUI();
}

export function initQuiz() {
  initTtsControls();
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  document.getElementById('msContinue').addEventListener('click', continueRun);
  // every "back to wheel" control (quiz back, progress back, milestone return)
  document.querySelectorAll('[data-action="wheel"]').forEach(b => b.addEventListener('click', goToWheel));

  document.getElementById('chessEntryBtn').addEventListener('click', () => startQuiz(ECHECS_SEG));

  document.getElementById('mvEntryBtn').addEventListener('click', playMerveilleuxNow);
  document.getElementById('mvPlayNow').addEventListener('click', playMerveilleuxNow);
  document.getElementById('mvLater').addEventListener('click', closeMerveilleuxPopup);

  const entryIcon = document.getElementById('mvEntryIcon');
  if (entryIcon) entryIcon.innerHTML = unicornSVG('entry');
  const popupUnicorn = document.getElementById('mvPopupUnicorn');
  if (popupUnicorn) popupUnicorn.innerHTML = unicornSVG('popup');
  const gallop1 = document.getElementById('mvGallop1');
  if (gallop1) gallop1.innerHTML = unicornSVG('gallop1');
  const gallop2 = document.getElementById('mvGallop2');
  if (gallop2) gallop2.innerHTML = unicornSVG('gallop2');

  document.addEventListener('keydown', onCheatKeydown);
  const wheelTitle = document.getElementById('wheelTitle');
  if (wheelTitle) wheelTitle.addEventListener('click', onWheelTitleTap);

  resetPlaySession();
}
