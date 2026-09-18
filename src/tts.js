// Read-aloud (F-01): wraps the browser's speechSynthesis so quiz.js can read
// questions/options aloud for pre-readers, without any backend or bundler.
const STORAGE_KEY = 'qr_tts_enabled';

let frenchVoice = null;

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickFrenchVoice() {
  if (!isTtsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr')) || null;
}

// Voice lists load asynchronously in some browsers — grab one now, and again
// once the list is ready, so the very first read-aloud can already use it.
export function initTts() {
  if (!isTtsSupported()) return;
  frenchVoice = pickFrenchVoice();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    frenchVoice = pickFrenchVoice();
  }, { once: true });
}

export function isTtsEnabled() {
  return localStorage.getItem(STORAGE_KEY) !== 'off';
}

export function setTtsEnabled(on) {
  localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
}

export function stopSpeaking() {
  if (isTtsSupported()) window.speechSynthesis.cancel();
}

// Cancels whatever was being read, then speaks fresh text. Slower rate and a
// French voice/lang so a 5–7 year old (and pre-readers) can follow along.
export function speak(text) {
  if (!isTtsSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'fr-FR';
  utter.rate = 0.92;
  utter.pitch = 1;
  if (frenchVoice) utter.voice = frenchVoice;
  window.speechSynthesis.speak(utter);
}
