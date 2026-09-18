// Leaderboard screen: compares lifetime scores across the profiles under
// the signed-in account (siblings sharing the device), ranked by total
// correct answers.
import { getLeaderboard } from './db.js';
import { getCurrentProfile } from './profiles.js';
import { showScreen } from './ui.js';

const MEDALS = ['🥇', '🥈', '🥉'];

export async function openLeaderboard() {
  const prof = getCurrentProfile();
  if (!prof) { alert('Choisis un profil pour voir le classement. 🙂'); return; }
  showScreen('leaderboardScreen');
  const body = document.getElementById('leaderboardBody');
  body.innerHTML = '<div class="profile-loading">Chargement…</div>';
  const rows = await getLeaderboard();
  renderLeaderboard(rows, prof.id);
}

function renderLeaderboard(rows, currentId) {
  const body = document.getElementById('leaderboardBody');
  if (!rows.length) {
    body.innerHTML = '<div class="profile-hint">Personne n\'a encore joué. Lance une partie ! 🎈</div>';
    return;
  }
  body.innerHTML = rows.map((r, i) => `
    <div class="lb-row${r.id === currentId ? ' lb-me' : ''}">
      <span class="lb-rank">${MEDALS[i] || (i + 1) + '.'}</span>
      <span class="lb-avatar">${r.avatar}</span>
      <span class="lb-name">${r.name}</span>
      <span class="lb-stats"><b>${r.correct}</b> bonnes · ${r.accuracy}%</span>
    </div>`).join('');
}

export function initLeaderboard() {
  document.getElementById('leaderboardBtn').addEventListener('click', openLeaderboard);
}
