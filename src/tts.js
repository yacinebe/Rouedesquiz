// Read-aloud (F-01): wraps the browser's speechSynthesis so quiz.js can read
// questions/options aloud for pre-readers, without any backend or bundler.
const STORAGE_KEY = 'qr_tts_enabled';

let frenchVoice = null;
let arabicVoice = null;

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickVoice(langPrefix) {
  if (!isTtsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix)) || null;
}

// Voice lists load asynchronously in some browsers — grab one now, and again
// once the list is ready, so the very first read-aloud can already use it.
export function initTts() {
  if (!isTtsSupported()) return;
  frenchVoice = pickVoice('fr');
  arabicVoice = pickVoice('ar');
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    frenchVoice = pickVoice('fr');
    arabicVoice = pickVoice('ar');
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

function queueUtterance(text, lang) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.92;
  utter.pitch = 1;
  if (lang === 'ar') {
    utter.lang = 'ar-SA';
    if (arabicVoice) utter.voice = arabicVoice;
  } else {
    utter.lang = 'fr-FR';
    if (frenchVoice) utter.voice = frenchVoice;
  }
  window.speechSynthesis.speak(utter);
}

// Cancels whatever was being read, then speaks fresh text. Slower rate and a
// French voice/lang so a 5–7 year old (and pre-readers) can follow along.
export function speak(text) {
  if (!isTtsSupported() || !text) return;
  window.speechSynthesis.cancel();
  queueUtterance(text, 'fr');
}

// Same as speak(), but takes [{ text, lang }] parts (lang: 'fr' | 'ar') and
// reads them back to back — each part gets the matching voice/lang, so e.g.
// an all-Arabic question is read with an Arabic voice (when the browser/OS
// has one) instead of a French voice guessing at Arabic script.
export function speakParts(parts) {
  if (!isTtsSupported() || !parts || parts.length === 0) return;
  window.speechSynthesis.cancel();
  parts.filter(p => p && p.text).forEach(p => queueUtterance(p.text, p.lang));
}
