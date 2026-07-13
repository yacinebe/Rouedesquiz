// The spinning theme wheel: draw, spin, click-to-select, and the
// "Jouer ce thème" launch button.
import { SEGMENTS } from './segments.js';
import { launchConfetti } from './ui.js';
import { startQuiz } from './quiz.js';

const N = SEGMENTS.length;
const ARC = (2 * Math.PI) / N;
const SIZE = 380;
const CX = SIZE / 2, CY = SIZE / 2, R = SIZE / 2 - 4;

let canvas, ctx;
let currentAngle = 0;
let spinning = false;
let currentSeg = null;

// Render the wheel onto any context at a given size. `labels` draws the theme
// names (skipped on the small welcome wheel for a cleaner look).
function renderWheel(context, size, angle, labels) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  context.clearRect(0, 0, size, size);
  for (let i = 0; i < N; i++) {
    const start = angle + i * ARC;
    const end   = start + ARC;
    const seg   = SEGMENTS[i];

    context.beginPath();
    context.moveTo(cx, cy);
    context.arc(cx, cy, r, start, end);
    context.closePath();
    context.fillStyle = seg.color;
    context.fill();

    context.strokeStyle = 'rgba(255,255,255,0.25)';
    context.lineWidth = 2;
    context.stroke();

    context.save();
    context.translate(cx, cy);
    context.rotate(start + ARC / 2);
    if (labels) {
      context.textAlign = 'right';
      context.font = `${size * 0.056}px serif`;
      context.fillText(seg.emoji, r - 10, 6);
      context.font = `bold ${size * 0.038}px 'Nunito', sans-serif`;
      context.fillStyle = seg.dark;
      context.fillText(seg.label, r - 42, 6);
    } else {
      // Decorative welcome wheel: one big theme emoji centred in each wedge.
      context.textAlign = 'center';
      context.font = `${size * 0.14}px serif`;
      context.fillText(seg.emoji, r * 0.6, size * 0.05);
    }
    context.restore();
  }

  context.beginPath();
  context.arc(cx, cy, size * 0.089, 0, 2 * Math.PI);
  context.fillStyle = '#fff';
  context.fill();
  context.strokeStyle = 'rgba(255,255,255,0.3)';
  context.lineWidth = 3;
  context.stroke();
}

function drawWheel(angle) {
  renderWheel(ctx, SIZE, angle, true);
}

// Static decorative wheel for the welcome screen.
export function paintWelcome() {
  const c = document.getElementById('welcomeWheel');
  if (c) renderWheel(c.getContext('2d'), c.width, 0, false);
}

function getWinner(angle) {
  const normalized = (((-angle - Math.PI / 2) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return SEGMENTS[Math.floor(normalized / ARC) % N];
}

function spin() {
  if (spinning) return;
  spinning = true;
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('resultArea').innerHTML = '';

  const totalDelta = (5 + Math.random() * 5) * 2 * Math.PI + Math.random() * 2 * Math.PI;
  const duration   = 4000 + Math.random() * 1500;
  const start      = performance.now();
  const startAngle = currentAngle;

  // Deceleration + a damped two-bounce rebound that settles exactly on target
  // (wobble is 0 at t=1, so getWinner still lands on startAngle + totalDelta).
  const WOBBLE = 0.28; // radians of overshoot
  const decel  = (t) => 1 - Math.pow(1 - t, 3);
  const wobble = (t) => {
    if (t < 0.62) return 0;
    const u = (t - 0.62) / 0.38;                          // 0→1 over the settle phase
    return Math.sin(u * Math.PI * 4) * (1 - u) * WOBBLE;  // 2 rebounds, damping to 0
  };

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    currentAngle = startAngle + totalDelta * decel(t) + wobble(t);
    drawWheel(currentAngle);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      spinning = false;
      document.getElementById('spinBtn').disabled = false;
      currentSeg = getWinner(currentAngle);
      showWheelResult(currentSeg);
    }
  }
  requestAnimationFrame(frame);
}

function showWheelResult(seg) {
  const area = document.getElementById('resultArea');
  area.innerHTML = `
    <div class="result-card ${seg.cls}">
      <div class="rc-top">
        <span class="result-emoji">${seg.emoji}</span>
        <span>${seg.label} !</span>
      </div>
      <button class="start-quiz-btn">Jouer ce thème →</button>
    </div>`;
  area.querySelector('.start-quiz-btn').addEventListener('click', () => startQuiz(currentSeg));
  launchConfetti(seg.color);
}

export function initWheel() {
  canvas = document.getElementById('wheel');
  ctx = canvas.getContext('2d');
  drawWheel(0);

  document.getElementById('spinBtn').addEventListener('click', spin);

  // Click directly on a slice to select it (skips the spin animation)
  canvas.addEventListener('click', (e) => {
    if (spinning) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width  / rect.width);
    const y = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const dx = x - CX, dy = y - CY;
    const dist = Math.hypot(dx, dy);
    // Outside wheel rim or inside the central hub (where the spin button sits) → ignore
    if (dist > R || dist < 36) return;
    const clickAngle = Math.atan2(dy, dx);
    const normalized = (((clickAngle - currentAngle) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const idx = Math.floor(normalized / ARC) % N;
    currentSeg = SEGMENTS[idx];
    showWheelResult(currentSeg);
  });
}
