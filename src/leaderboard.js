// Leaderboard screen: ranks the sibling profiles under the signed-in
// account by lifetime correct answers (accuracy % as a tie-breaker).
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
  const played = rows.filter(r => r.answered > 0);
  if (!played.length) {
    body.innerHTML = '<div class="profile-hint">Personne n\'a encore joué. Lance-toi ! 🎈</div>';
    return;
  }
  body.innerHTML = played.map((r, i) => `
    <div class="lb-card${r.id === currentId ? ' lb-me' : ''}">
      <div class="lb-rank">${MEDALS[i] || (i + 1) + '.'}</div>
      <div class="lb-avatar">${r.avatar || '🙂'}</div>
      <div class="lb-info">
        <div class="lb-name">${r.first_name}</div>
        <div class="lb-stats"><b>${r.correct}</b> bonnes réponses · ${r.accuracy}% réussite</div>
      </div>
    </div>`).join('');
}

export function initLeaderboard() {
  document.getElementById('leaderboardBtn').addEventListener('click', openLeaderboard);
}
