// Entry point: wires up the wheel, quiz, progress, and profiles, then
// signs in and renders the "Qui joue ?" picker.
import { initWheel } from './wheel.js';
import { initQuiz } from './quiz.js';
import { initProgress } from './progress.js';
import { initProfiles } from './profiles.js';

initWheel();       // draws the wheel, wires spin + slice-click
initQuiz();        // wires next / continue / back-to-wheel
initProgress();    // wires the "Mes progrès" button
initProfiles();    // async: anonymous sign-in + render the picker

// Signals to the file:// fallback (in index.html) that the app loaded.
window.__qrReady = true;
