// Shared UI helpers: screen navigation, confetti, shuffle.

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Current-player badge: shown while playing (wheel / quiz / milestone),
  // once a player (or guest) has been chosen so the name is populated.
  const cp = document.getElementById('currentPlayer');
  if (cp) {
    const onPlay = id === 'wheelScreen' || id === 'quizScreen' || id === 'milestoneScreen';
    const named = cp.querySelector('.cp-name').textContent;
    cp.style.display = (onPlay && named) ? 'flex' : 'none';
  }
}

export function launchConfetti(color) {
  const colors = [color, '#fff', '#FFE66D', '#4ECDC4', '#FF6B6B', '#C084FC', '#60AFFF'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    const s = (8 + Math.random() * 8) + 'px';
    el.style.width = el.style.height = s;
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
