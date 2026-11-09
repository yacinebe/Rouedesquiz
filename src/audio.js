// Sound effects (F-29): short kid-friendly SFX for key moments, played from
// real files on the Worker CDN — mirrors image hosting (T-23), same domain,
// `/audio/<name>.mp3`. No looping background music on purpose (parent-friendly).
// The 6 files aren't uploaded yet (see BACKLOG_FUNCTIONAL.md F-29): until then
// every play() fails to load and is swallowed, so the game stays silent but
// fully playable — never a visible error.
const CDN_BASE = 'https://quiz-images.yacineberrada.workers.dev/audio/';
const STORAGE_KEY = 'qr_muted';
const VOLUME = 0.6;
const SOUNDS = ['spin', 'land', 'correct', 'wrong', 'win', 'cheer'];

const cache = {};

function getAudio(name) {
  if (!cache[name]) {
    const el = new Audio(`${CDN_BASE}${name}.mp3`);
    el.preload = 'none';
    el.volume = VOLUME;
    cache[name] = el;
  }
  return cache[name];
}

export function isMuted() {
  return localStorage.getItem(STORAGE_KEY) === 'on';
}

export function setMuted(on) {
  localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
}

// Fail-silent by design: muted, offline, missing file (not uploaded yet) or
// blocked by the browser's autoplay policy all just mean no sound.
export function playSound(name) {
  if (isMuted() || !SOUNDS.includes(name)) return;
  try {
    const el = getAudio(name);
    el.currentTime = 0;
    el.play().catch(() => {});
  } catch {
    // ignore — see fail-silent note above
  }
}

function updateMuteButtonUI() {
  const btn = document.getElementById('muteBtn');
  if (!btn) return;
  const muted = isMuted();
  btn.textContent = muted ? '🔇' : '🔊';
  btn.classList.toggle('off', muted);
  const label = muted ? 'Sons désactivés (appuie pour activer)' : 'Sons activés (appuie pour désactiver)';
  btn.title = label;
  btn.setAttribute('aria-label', label);
}

export function initAudio() {
  const btn = document.getElementById('muteBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      setMuted(!isMuted());
      updateMuteButtonUI();
    });
  }
  updateMuteButtonUI();
}
