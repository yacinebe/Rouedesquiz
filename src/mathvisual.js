// F-51 refinement (#46): a hideable picture under each addition/subtraction
// question. Tens are boxes of 10 dots, units are single dots. For a subtraction
// the dots being taken away are faded and crossed out.
const KEY = 'mathVisualHidden';
const RE = /(\d+)\s*([+\-−])\s*(\d+)/;

export function parseSum(text) {
  const m = RE.exec(text || '');
  if (!m) return null;
  const a = +m[1], b = +m[3], op = m[2] === '+' ? '+' : '-';
  if (a > 99 || b > 99 || (op === '-' && b > a)) return null;
  return { a, b, op };
}

function dot(cls = '') { return `<span class="mv-dot ${cls}"></span>`; }

// n dots as full "dizaines" (boxes of 10) plus loose units; the last `gone`
// dots (counted across tens then units) are marked as taken away.
function group(n, gone = 0) {
  const tens = Math.floor(n / 10), units = n % 10;
  let i = 0, html = '';
  const next = () => (gone && i++ >= n - gone ? 'gone' : '');
  for (let t = 0; t < tens; t++) {
    let d = '';
    for (let k = 0; k < 10; k++) d += dot(next());
    html += `<span class="mv-ten">${d}</span>`;
  }
  if (units) {
    let d = '';
    for (let k = 0; k < units; k++) d += dot(next());
    html += `<span class="mv-units">${d}</span>`;
  }
  return html;
}

function isHidden() { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } }
function setHidden(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch { /* ignore */ } }

export function renderMathVisual(el, questionText) {
  const s = parseSum(questionText);
  if (!s) { el.style.display = 'none'; el.innerHTML = ''; return; }
  const body = s.op === '+'
    ? `${group(s.a)}<span class="mv-op">+</span>${group(s.b)}`
    : group(s.a, s.b);
  el.style.display = '';
  el.innerHTML =
    `<button type="button" class="mv-toggle"></button>` +
    `<div class="mv-body" aria-hidden="true">${body}</div>`;
  const btn = el.querySelector('.mv-toggle');
  const bodyEl = el.querySelector('.mv-body');
  const apply = () => {
    const h = isHidden();
    bodyEl.style.display = h ? 'none' : '';
    btn.textContent = h ? '👀 Voir le dessin' : '🙈 Cacher le dessin';
  };
  btn.addEventListener('click', () => { setHidden(!isHidden()); apply(); });
  apply();
}
