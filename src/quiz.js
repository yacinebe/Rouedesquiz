// Quiz loop: endless run per theme (or a finite "revise mistakes" replay),
// with a milestone every 10 questions.
import { showScreen, launchConfetti, shuffle } from './ui.js';
import { fetchQuestions, logAttempt, logSession } from './db.js';
import { getProfileId } from './profiles.js';

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

export async function startQuiz(seg) {
  if (!seg) return;
  // DB first (Supabase), fall back to the static questions.js bank (offline-safe).
  let pool = await fetchQuestions(seg.cls);
  if (!pool || pool.length === 0) {
    pool = (window.QUIZ_DATA && window.QUIZ_DATA[seg.cls]) || [];
  }
  if (!pool || pool.length === 0) {
    document.getElementById('resultArea').innerHTML =
      `<div class="result-card ${seg.cls}"><div class="rc-top"><span>Aucune question pour ce thème 😅</span></div></div>`;
    return;
  }
  beginRun({ theme: seg.cls, label: seg.label, color: seg.color,
             emoji: seg.emoji, cls: seg.cls, pool, endless: true });
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

  setBadgeScore();
  showScreen('quizScreen');
  currentQ = drawNext();
  renderQuestion();
}

function drawNext() {
  if (!queue.length) {
    if (endless) queue = shuffle(poolCache.slice());
    else return null;                 // finite run exhausted
  }
  return queue.shift();
}

// Live score shown under the player's name (top-right badge).
function setBadgeScore() {
  const el = document.querySelector('#currentPlayer .cp-score');
  if (el) el.textContent = runCount ? `⭐ ${runScore}/${runCount}` : '';
}

function renderQuestion() {
  answered = false;
  const q = currentQ;
  if (!q) { runComplete(); return; }
  const letters = ['A', 'B', 'C', 'D'];
  const posInBlock = runCount % MILESTONE;   // answered so far in the current block

  document.getElementById('questionNum').textContent = `Question ${runCount + 1}`;
  document.getElementById('questionText').textContent = q.question;

  // Question image (optional — illustration or image-as-question)
  const imgWrap = document.getElementById('questionImageWrap');
  if (q.image) {
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
  finalizeRun();
  showScreen('wheelScreen');
}

export function initQuiz() {
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  document.getElementById('msContinue').addEventListener('click', continueRun);
  // every "back to wheel" control (quiz back, progress back, milestone return)
  document.querySelectorAll('[data-action="wheel"]').forEach(b => b.addEventListener('click', goToWheel));
}
