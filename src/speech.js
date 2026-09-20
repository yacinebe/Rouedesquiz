// Voice answering (F-13): wraps the browser's SpeechRecognition so a child
// can answer a question out loud instead of tapping, without any backend or
// bundler. T-10 (cloud STT) hasn't shipped yet, so this relies entirely on
// whatever recognition the browser ships (solid in Chrome/Edge, absent in
// Firefox/Safari) — callers must treat it as a bonus input method and always
// keep the normal tap-to-answer path working regardless of support/quality.

const SpeechRecognitionImpl = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

let activeRecognition = null;

export function isSttSupported() {
  return !!SpeechRecognitionImpl;
}

// One-shot listen: resolves with the best-guess transcript (lowercased,
// trimmed) once the child stops talking, or null on silence/error/denied
// mic permission/already-listening. Never rejects — callers just treat a
// null the same as "didn't catch that, try again".
export function listenOnce(lang) {
  if (!isSttSupported() || activeRecognition) return Promise.resolve(null);
  return new Promise((resolve) => {
    const rec = new SpeechRecognitionImpl();
    activeRecognition = rec;
    rec.lang = lang === 'ar' ? 'ar-SA' : 'fr-FR';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      activeRecognition = null;
      resolve(value);
    };

    rec.onresult = (e) => {
      const transcript = e.results && e.results[0] && e.results[0][0] && e.results[0][0].transcript;
      finish(transcript ? transcript.toLowerCase().trim() : null);
    };
    rec.onerror = () => finish(null);
    rec.onend = () => finish(null);

    try { rec.start(); } catch { finish(null); }
  });
}

// Cancels whatever recognition is in flight (question changed, leaving the
// quiz…) — its listenOnce() promise still resolves, with null, via onend.
export function stopListening() {
  if (!activeRecognition) return;
  try { activeRecognition.stop(); } catch { /* already stopped */ }
}
