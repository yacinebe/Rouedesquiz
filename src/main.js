// Entry point: wires up the wheel, quiz, progress, and profiles, then
// signs in and renders the "Qui joue ?" picker.
import { initWheel } from './wheel.js';
import { initQuiz } from './quiz.js';
import { initProgress } from './progress.js';
import { initLeaderboard } from './leaderboard.js';
import { initProfiles } from './profiles.js';
import { initAuth } from './auth.js';
import { initAudio } from './audio.js';

initWheel();       // draws the wheel, wires spin + slice-click
initQuiz();        // wires next / continue / back-to-wheel
initProgress();    // wires the "Mes progrès" button
initLeaderboard(); // wires the "Classement" button
initProfiles();    // wires the profile picker (create form, manage, badge)
initAuth();        // routes to welcome or profiles; wires sign in / up / out
initAudio();       // wires the 🔊/🔇 mute toggle (persisted)

// Signals to the file:// fallback (in index.html) that the app loaded.
window.__qrReady = true;
