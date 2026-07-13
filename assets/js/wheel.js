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

function drawWheel(angle) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < N; i++) {
    const start = angle + i * ARC;
    const end   = start + ARC;
    const seg   = SEGMENTS[i];

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(start + ARC / 2);
    ctx.textAlign = 'right';

    ctx.font = `${SIZE * 0.056}px serif`;
    ctx.fillText(seg.emoji, R - 10, 6);

    ctx.font = `bold ${SIZE * 0.038}px 'Nunito', sans-serif`;
    ctx.fillStyle = seg.dark;
    ctx.fillText(seg.label, R - 42, 6);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(CX, CY, 34, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 3;
  ctx.stroke();
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

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    currentAngle = startAngle + totalDelta * easeOut(t);
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
