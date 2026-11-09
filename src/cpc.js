// F-50: Jean Mermoz CP C mode — a menu of 4 big choices (no spinning wheel).
// Each choice starts the same endless quiz run as a wheel theme.
import { CPC_SEGMENTS } from './segments.js';
import { startQuiz } from './quiz.js';
import { showScreen } from './ui.js';

export function initCpc() {
  const box = document.getElementById('cpcChoices');
  const msg = document.getElementById('cpcMsg');
  CPC_SEGMENTS.forEach(seg => {
    const btn = document.createElement('button');
    btn.className = 'cpc-choice';
    btn.style.setProperty('--c', seg.color);
    btn.innerHTML = `<span class="cpc-emoji">${seg.emoji}</span><span>${seg.label}</span>`;
    btn.addEventListener('click', async () => {
      msg.textContent = '';
      const started = await startQuiz(seg);
      // Question banks ship empty (content comes in separate stories).
      if (!started) msg.textContent = 'Les questions arrivent bientôt ! 🎈';
    });
    box.appendChild(btn);
  });
  document.getElementById('cpcEntryBtn').addEventListener('click', () => {
    msg.textContent = '';
    showScreen('cpcScreen');
  });
  document.getElementById('cpcBack').addEventListener('click', () => showScreen('wheelScreen'));
}
