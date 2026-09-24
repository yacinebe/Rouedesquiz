// Mode Échecs (F-48, phase 1) — "where can this piece go?" questions.
// Positions are generated here from plain movement rules on an otherwise
// empty board: random piece, random square, one legal destination and
// three illegal-but-plausible ones. Endless and always correct — no DB
// rows, nothing in questions.js, no reseed.
import { shuffle } from './ui.js';

const FILES = 'abcdefgh';

function squareName(file, rank) { return FILES[file] + (rank + 1); }
function onBoard(file, rank) { return file >= 0 && file < 8 && rank >= 0 && rank < 8; }

function step(file, rank, deltas) {
  return deltas.map(([df, dr]) => [file + df, rank + dr]).filter(([f, r]) => onBoard(f, r));
}

function slide(file, rank, dirs) {
  const out = [];
  for (const [df, dr] of dirs) {
    let f = file + df, r = rank + dr;
    while (onBoard(f, r)) { out.push([f, r]); f += df; r += dr; }
  }
  return out;
}

const ROOK_DIRS     = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS    = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const KING_DELTAS    = [...ROOK_DIRS, ...BISHOP_DIRS];
const KNIGHT_DELTAS  = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];

function knightMoves(f, r) { return step(f, r, KNIGHT_DELTAS); }
function kingMoves(f, r)   { return step(f, r, KING_DELTAS); }
function rookMoves(f, r)   { return slide(f, r, ROOK_DIRS); }
function bishopMoves(f, r) { return slide(f, r, BISHOP_DIRS); }
function queenMoves(f, r)  { return slide(f, r, [...ROOK_DIRS, ...BISHOP_DIRS]); }

// A lone generated pawn has no game context to fix a colour/side, so it's
// arbitrarily always "moving up" the board (toward rank 8): one square
// forward, or two from its starting rank — never sideways or diagonal,
// since there's nothing on the board to capture in phase 1.
function pawnMoves(f, r) {
  const out = [];
  if (onBoard(f, r + 1)) out.push([f, r + 1]);
  if (r === 1 && onBoard(f, r + 2)) out.push([f, r + 2]);
  return out;
}

export const PIECES = {
  cavalier: { symbol: '♞', moves: knightMoves, question: 'Où peut aller le cavalier ?' },
  fou:      { symbol: '♝', moves: bishopMoves, question: 'Où peut aller le fou ?' },
  tour:     { symbol: '♜', moves: rookMoves,   question: 'Où peut aller la tour ?' },
  dame:     { symbol: '♛', moves: queenMoves,  question: 'Où peut aller la dame ?' },
  roi:      { symbol: '♚', moves: kingMoves,   question: 'Où peut aller le roi ?' },
  pion:     { symbol: '♟', moves: pawnMoves,   question: 'Où peut aller le pion ?' },
};
const PIECE_KEYS = Object.keys(PIECES);

function randomSquare() {
  return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
}

// Squares that look like *some* piece's move from `from` (knight/king/
// rook/bishop/pawn shapes) — the pool distractors are drawn from first, so
// a wrong answer resembles a real chess move (just the wrong piece's one),
// e.g. a diagonal square offered as a wrong answer for a tour.
function moveShapedSquares(f, r) {
  return [
    ...knightMoves(f, r), ...kingMoves(f, r),
    ...rookMoves(f, r), ...bishopMoves(f, r), ...pawnMoves(f, r),
  ];
}

function dedupeSquares(list) {
  const seen = new Set();
  const out = [];
  for (const [f, r] of list) {
    const k = f + ',' + r;
    if (!seen.has(k)) { seen.add(k); out.push([f, r]); }
  }
  return out;
}

// One generated question: a random piece on a random square with at least
// one legal move, one correct destination among 4 options, and 3 wrong
// ones that are never the piece's own square and never actually legal.
export function generateChessQuestion() {
  let pieceKey, from, legal;
  do {
    pieceKey = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
    from = randomSquare();
    legal = PIECES[pieceKey].moves(from[0], from[1]);
  } while (legal.length === 0); // only a pawn drawn on rank 8 can hit this — retry

  const piece = PIECES[pieceKey];
  const legalKeys = new Set(legal.map(([f, r]) => f + ',' + r));
  const [cf, cr] = legal[Math.floor(Math.random() * legal.length)];
  const correct = squareName(cf, cr);

  const shapedPool = dedupeSquares(moveShapedSquares(from[0], from[1]))
    .filter(([f, r]) => !legalKeys.has(f + ',' + r) && !(f === from[0] && r === from[1]));
  shuffle(shapedPool);

  const distractors = shapedPool.slice(0, 3).map(([f, r]) => squareName(f, r));

  // Extremely sparse boards (e.g. a cornered king) can come up short on
  // "plausible" squares — top up with any other illegal, non-origin square.
  if (distractors.length < 3) {
    const taken = new Set([correct, squareName(from[0], from[1]), ...distractors]);
    const rest = [];
    for (let f = 0; f < 8; f++) {
      for (let r = 0; r < 8; r++) {
        const name = squareName(f, r);
        if (!taken.has(name) && !legalKeys.has(f + ',' + r)) rest.push(name);
      }
    }
    shuffle(rest);
    while (distractors.length < 3 && rest.length) distractors.push(rest.pop());
  }

  const options = shuffle([correct, ...distractors]);
  return {
    question: piece.question,
    options,
    answer: correct,
    difficulty: null,
    board: { piece: pieceKey, symbol: piece.symbol, from: squareName(from[0], from[1]) },
  };
}

// Read-only 8×8 board with file/rank labels and the single piece on its
// square. Not interactive on purpose (phase 1): the 4 option buttons carry
// the actual answers, the board is just the illustration.
export function renderChessBoardHTML(fromSquare, symbol) {
  let cells = '';
  for (let rank = 8; rank >= 1; rank--) {
    cells += `<div class="chess-rank-label">${rank}</div>`;
    for (let fi = 0; fi < 8; fi++) {
      const name = FILES[fi] + rank;
      const light = (fi + rank) % 2 === 0;
      const isPiece = name === fromSquare;
      cells += `<div class="chess-sq ${light ? 'light' : 'dark'}${isPiece ? ' chess-piece-sq' : ''}">${isPiece ? symbol : ''}</div>`;
    }
  }
  cells += '<div class="chess-corner"></div>';
  for (let fi = 0; fi < 8; fi++) cells += `<div class="chess-file-label">${FILES[fi]}</div>`;
  return `<div class="chess-board" role="img" aria-label="Échiquier">${cells}</div>`;
}
