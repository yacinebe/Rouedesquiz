// Shared UI helpers: screen navigation, confetti, shuffle.

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Play controls (top-right): the mute toggle (F-29) + current-player badge,
  // shown while playing (wheel / quiz / milestone) — same screens SFX plays on.
  const onPlay = id === 'wheelScreen' || id === 'quizScreen' || id === 'milestoneScreen';
  const controls = document.getElementById('playControls');
  if (controls) controls.classList.toggle('show', onPlay);
  // The player badge itself only appears once a player (or guest) has been
  // chosen so the name is populated.
  const cp = document.getElementById('currentPlayer');
  if (cp) {
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

// Inline-SVG unicorn used across Mode Merveilleux (F-31 follow-up): the
// unlock popup, the wheel-screen entry button, and the in-quiz companion.
// `uid` keeps each instance's <defs> gradient ids unique so several copies
// can live in the DOM at once without colliding. CSS (see .unicorn-svg in
// app.css) drives the horn shimmer / sparkle-twinkle motion.
export function unicornSVG(uid) {
  return `<svg class="unicorn-svg" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="mvMane-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FF9BEE"/>
        <stop offset="35%" stop-color="#C084FC"/>
        <stop offset="70%" stop-color="#60AFFF"/>
        <stop offset="100%" stop-color="#FFE66D"/>
      </linearGradient>
      <linearGradient id="mvHorn-${uid}" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#F2B93B"/>
        <stop offset="100%" stop-color="#FFF6D6"/>
      </linearGradient>
    </defs>
    <path class="mv-mane" fill="url(#mvMane-${uid})" d="M30 42 C12 33 9 56 21 63 C7 68 12 89 30 85 C25 99 48 105 56 91 C63 101 82 93 78 79 C93 82 97 61 82 55 C91 45 80 27 64 35 C61 21 39 23 30 42 Z"/>
    <path d="M44 27 L50 13 L56 29 Z" fill="#fffaf3"/>
    <path d="M47 25 L50 17 L53 26 Z" fill="#ffc2ec"/>
    <polygon class="mv-horn" fill="url(#mvHorn-${uid})" points="62,6 68,34 56,34"/>
    <line x1="59" y1="14" x2="65" y2="17" stroke="#fff" stroke-width="1.4" opacity=".65"/>
    <line x1="58" y1="21" x2="66" y2="25" stroke="#fff" stroke-width="1.4" opacity=".65"/>
    <ellipse cx="60" cy="57" rx="30" ry="26" fill="#fffaf3"/>
    <ellipse cx="43" cy="68" rx="14" ry="11" fill="#fffaf3"/>
    <ellipse cx="35" cy="70" rx="2.2" ry="2.8" fill="#e8a9cf"/>
    <ellipse cx="53" cy="68" rx="5" ry="3" fill="#ffc2e6" opacity=".8"/>
    <ellipse cx="74" cy="59" rx="5" ry="3" fill="#ffc2e6" opacity=".8"/>
    <circle cx="68" cy="53" r="4.2" fill="#3a2a4d"/>
    <circle cx="69.4" cy="51.4" r="1.3" fill="#fff"/>
    <path d="M41 76 Q47 80 53 76" stroke="#e39bc4" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle class="mv-spark mv-spark-a" cx="18" cy="20" r="2.6" fill="#fff6c9"/>
    <circle class="mv-spark mv-spark-b" cx="100" cy="24" r="2" fill="#ffe6fb"/>
    <circle class="mv-spark mv-spark-c" cx="94" cy="70" r="1.6" fill="#e0f2ff"/>
  </svg>`;
}
