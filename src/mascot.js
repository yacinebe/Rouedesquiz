// Mascot reactions (F-07): a small sidekick on the quiz screen that thinks
// while the child chooses, cheers on a right answer and comforts on a wrong one.
// The art is a PLACEHOLDER (simple SVG blob) until the F-33 hero character
// exists — only mascotSVG() below needs replacing; poses are: think, cheer, sad.

const PHRASES = {
  think: ['Hmm… à ton avis ?', 'Je réfléchis avec toi !', 'Prends ton temps !'],
  cheer: ['Bravo !', 'Super !', 'Youpi, bien joué !', 'Tu es fortiche !'],
  sad: ['Essaie encore !', 'Ce n\'est pas grave !', 'Tu vas y arriver !']
};

// Face features per pose (eyes + mouth); body shared.
const FACES = {
  think: `<circle cx="38" cy="50" r="5" fill="#2b2140"/><circle cx="62" cy="50" r="5" fill="#2b2140"/>
    <circle cx="40" cy="48" r="1.6" fill="#fff"/><circle cx="64" cy="48" r="1.6" fill="#fff"/>
    <path d="M42 68 Q50 66 58 70" stroke="#2b2140" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M30 38 Q38 33 46 38" stroke="#2b2140" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  cheer: `<path d="M31 52 Q38 42 45 52" stroke="#2b2140" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M55 52 Q62 42 69 52" stroke="#2b2140" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M36 62 Q50 82 64 62 Z" fill="#2b2140"/><path d="M42 70 Q50 77 58 70 Q50 66 42 70Z" fill="#ff7a8a"/>
    <path d="M8 56 L22 30" stroke="#FFB84D" stroke-width="9" stroke-linecap="round"/>
    <path d="M92 56 L78 30" stroke="#FFB84D" stroke-width="9" stroke-linecap="round"/>`,
  sad: `<circle cx="38" cy="52" r="5" fill="#2b2140"/><circle cx="62" cy="52" r="5" fill="#2b2140"/>
    <circle cx="40" cy="50" r="1.6" fill="#fff"/><circle cx="64" cy="50" r="1.6" fill="#fff"/>
    <path d="M42 72 Q50 64 58 72" stroke="#2b2140" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M30 42 L45 46 M70 42 L55 46" stroke="#2b2140" stroke-width="2.5" stroke-linecap="round"/>`
};

function mascotSVG(pose) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <ellipse cx="50" cy="90" rx="26" ry="6" fill="#000" opacity=".18"/>
    <circle cx="50" cy="55" r="36" fill="#FFB84D"/>
    <circle cx="50" cy="55" r="36" fill="none" stroke="#e8962a" stroke-width="3"/>
    <ellipse cx="38" cy="36" rx="12" ry="7" fill="#fff" opacity=".35"/>
    <circle cx="28" cy="64" r="5" fill="#ff8fa3" opacity=".6"/><circle cx="72" cy="64" r="5" fill="#ff8fa3" opacity=".6"/>
    ${FACES[pose]}
  </svg>`;
}

let el, bubbleEl, figEl;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function setPose(pose, text) {
  if (!el) return;
  el.dataset.pose = pose;
  figEl.innerHTML = mascotSVG(pose);
  bubbleEl.textContent = text;
}

// Called when a new question appears.
export function mascotThink() { setPose('think', pick(PHRASES.think)); }

// Called right after the answer is chosen; the next question calls
// mascotThink() again, so no reset timer is needed.
export function mascotReact(isCorrect) {
  setPose(isCorrect ? 'cheer' : 'sad', pick(isCorrect ? PHRASES.cheer : PHRASES.sad));
}

export function initMascot() {
  el = document.getElementById('mascot');
  if (!el) return;
  bubbleEl = el.querySelector('.mascot-bubble');
  figEl = el.querySelector('.mascot-fig');
  setPose('think', '');
}
