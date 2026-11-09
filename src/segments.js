// Theme definitions for the wheel + progress. cls matches the questions.js keys.
export const SEGMENTS = [
  { label: 'Maths',      emoji: '➕', color: '#FF6B6B', dark: '#c0392b', cls: 'math' },
  { label: 'Lecture',    emoji: '📖', color: '#4ECDC4', dark: '#16a085', cls: 'lecture' },
  { label: 'Géographie', emoji: '🌍', color: '#FFE66D', dark: '#b7950b', cls: 'geographie' },
  { label: 'Astronomie', emoji: '🔭', color: '#60AFFF', dark: '#1a5f8a', cls: 'astronomie' },
  { label: 'Animaux',    emoji: '🐾', color: '#6BCB77', dark: '#15803d', cls: 'animaux' },
  { label: 'Arabe',      emoji: '🔤', color: '#F59E0B', dark: '#92400e', cls: 'arabe' },
  { label: 'Surprise !', emoji: '⭐', color: '#C084FC', dark: '#7d3c98', cls: 'surprise' },
];

// F-50: "Jean Mermoz CP C" mode — four fixed choices instead of a wheel.
// Own theme keys (cpc_*) so their questions/progress never mix with the wheel's.
export const CPC_SEGMENTS = [
  { label: 'Français', emoji: '📚', color: '#FF6B6B', dark: '#c0392b', cls: 'cpc_francais' },
  { label: 'Math',     emoji: '➕', color: '#60AFFF', dark: '#1a5f8a', cls: 'cpc_math' },
  { label: 'Arabe',    emoji: '🔤', color: '#F59E0B', dark: '#92400e', cls: 'cpc_arabe' },
  { label: 'Anglais',  emoji: '🇬🇧', color: '#6BCB77', dark: '#15803d', cls: 'cpc_anglais' },
];
