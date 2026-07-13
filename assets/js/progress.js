// Progress page: per-theme answered / accuracy / correct, and a
// "revise mistakes" replay of the questions last answered wrong.
import { getProgress, fetchQuestionsByIds } from './db.js';
import { SEGMENTS } from './segments.js';
import { getCurrentProfile } from './profiles.js';
import { beginRun } from './quiz.js';
import { showScreen } from './ui.js';

let failedMap = {};

export async function openProgress() {
  const prof = getCurrentProfile();
  if (!prof) { alert('Choisis un profil pour voir tes progrès. 🙂'); return; }
  showScreen('progressScreen');
  const body = document.getElementById('progressBody');
  body.innerHTML = '<div class="profile-loading">Chargement…</div>';
  const prog = await getProgress(prof.id);
  renderProgress(prog);
}

function renderProgress(prog) {
  failedMap = prog.failed || {};
  const body = document.getElementById('progressBody');
  const played = SEGMENTS.filter(s => prog.byTheme[s.cls]);
  if (!played.length) {
    body.innerHTML = '<div class="profile-hint">Aucune partie jouée pour l\'instant. Va jouer ! 🎈</div>';
    return;
  }
  body.innerHTML = played.map(s => {
    const t = prog.byTheme[s.cls];
    const acc = t.answered ? Math.round(100 * t.correct / t.answered) : 0;
    const failed = t.failed || 0;
    return `<div class="prog-card" style="border-color:${s.color}">
      <div class="prog-head"><span class="prog-emoji">${s.emoji}</span><span class="prog-theme">${s.label}</span></div>
      <div class="prog-stats"><span><b>${t.answered}</b> répondues</span><span><b>${acc}%</b> réussies</span><span><b>${t.correct}</b> bonnes</span></div>
      ${failed
        ? `<button class="btn-primary prog-replay" data-theme="${s.cls}">🔁 Réviser mes erreurs (${failed})</button>`
        : `<div class="prog-done">Aucune erreur à réviser 🎉</div>`}
    </div>`;
  }).join('');
  body.querySelectorAll('.prog-replay').forEach(b =>
    b.addEventListener('click', () => startReplay(b.dataset.theme)));
}

async function startReplay(themeCls) {
  const ids = failedMap[themeCls] || [];
  if (!ids.length) return;
  const seg = SEGMENTS.find(s => s.cls === themeCls);
  const qs = await fetchQuestionsByIds(ids);
  if (!qs.length) { alert('Impossible de charger les questions à réviser.'); return; }
  beginRun({ theme: themeCls, label: 'Révision · ' + seg.label, color: seg.color,
             emoji: seg.emoji, cls: seg.cls, pool: qs, endless: false });
}

export function initProgress() {
  document.getElementById('progressBtn').addEventListener('click', openProgress);
}
