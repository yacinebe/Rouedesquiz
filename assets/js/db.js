/* ═══════════════════════════════════════════════════════════════
   QuizRoulette — Supabase client + data helpers
   Loaded as an ES module. supabase-js comes from a CDN (no build step).

   The URL and publishable key below are PUBLIC by design — data is
   protected by Row-Level Security in the database, not by hiding these.
   Never put the service_role / secret key here.
═══════════════════════════════════════════════════════════════ */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://pidiymkmondkiaanzyyy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_z6wCF2pvuXYAVttaPLZyLQ_IyPa5rqC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

/* ── Auth ────────────────────────────────────────────────────── */

// Ensure we have a session; create an anonymous one if needed.
// Returns the user, or null if we're offline / auth is unavailable.
export async function ensureSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user;
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) { console.warn('[db] anonymous sign-in failed:', error.message); return null; }
    return data.user;
  } catch (e) {
    console.warn('[db] ensureSession failed (offline?):', e);
    return null;
  }
}

/* ── Profiles ────────────────────────────────────────────────── */

// Selectable avatars for the profile form (3 "cool kids" + 2 adults).
// Stored as the emoji string on profiles.avatar. Swap to image paths here
// later if you add illustrated avatars under assets/.
export const AVATARS = [
  { emoji: '😎', label: 'Le Cool' },
  { emoji: '🦸', label: 'Super-héros' },
  { emoji: '🥷', label: 'Ninja' },
  { emoji: '🧙', label: 'Le Magicien' },
  { emoji: '👸', label: 'La Reine' }
];

export async function getProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birthdate, avatar, name, created_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    // first_name is canonical; fall back to legacy `name` for old rows.
    return (data ?? []).map(r => ({ ...r, first_name: r.first_name || r.name || 'Joueur' }));
  } catch (e) {
    console.warn('[db] getProfiles failed:', e);
    return [];
  }
}

// Map a Supabase/Postgres error to an honest, user-facing French message.
function friendlyError(error) {
  console.warn('[db] error:', error);
  const msg = error && error.message || '';
  if (error && error.code === '42703' || /column .* does not exist/i.test(msg))
    return "La base de données n'est pas à jour. Lance la migration Supabase (002_profiles_fields.sql) dans le SQL Editor.";
  if (error && (error.code === '42501' || error.code === 'PGRST301') || /row-level security|jwt|not authenticated/i.test(msg))
    return "Session non authentifiée. Recharge la page et réessaie.";
  if (error && error.code === '23505') return "Ce profil existe déjà.";
  return msg ? `Erreur : ${msg}` : "Une erreur est survenue.";
}
const OFFLINE = "Tu sembles hors ligne. Vérifie ta connexion et réessaie.";

// Returns { data } on success, { error: <message> } on failure.
export async function createProfile({ first_name, last_name = null, birthdate = null, avatar = null }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      // keep legacy `name` in sync for any tooling that still reads it
      .insert({ first_name, last_name, birthdate, avatar, name: first_name })
      .select('id, first_name, last_name, birthdate, avatar')
      .single();
    if (error) return { error: friendlyError(error) };
    return { data };
  } catch (e) {
    console.warn('[db] createProfile network error:', e);
    return { error: OFFLINE };
  }
}

// Returns { ok: true } on success, { error: <message> } on failure.
export async function deleteProfile(id) {
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) return { error: friendlyError(error) };
    return { ok: true };
  } catch (e) {
    console.warn('[db] deleteProfile network error:', e);
    return { error: OFFLINE };
  }
}

/* ── Progress (fire-and-forget; never block the game) ─────────── */

export async function logAttempt({ profile_id, question_id = null, theme, difficulty = null, is_correct }) {
  if (!profile_id) return;
  try {
    await supabase.from('attempts').insert({ profile_id, question_id, theme, difficulty, is_correct });
  } catch (e) {
    console.warn('[db] logAttempt failed:', e);
  }
}

export async function logSession({ profile_id, theme, score, total }) {
  if (!profile_id) return;
  try {
    await supabase.from('sessions').insert({ profile_id, theme, score, total });
  } catch (e) {
    console.warn('[db] logSession failed:', e);
  }
}

/* ── Questions ───────────────────────────────────────────────── */

// Fetch approved questions for a theme from the DB.
// Returns [] on failure so callers can fall back to window.QUIZ_DATA.
export async function fetchQuestions(theme) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id, difficulty, question, options, answer, image, option_images, legacy_id')
      .eq('theme', theme);
    if (error) throw error;
    // Normalize to the shape index.html's renderer expects.
    return (data ?? []).map(row => ({
      id: row.legacy_id ?? row.id,
      db_id: row.id,
      difficulty: row.difficulty,
      question: row.question,
      options: row.options,
      answer: row.answer,
      image: row.image ?? undefined,
      optionImages: row.option_images ?? undefined
    }));
  } catch (e) {
    console.warn('[db] fetchQuestions failed, will fall back to questions.js:', e);
    return [];
  }
}

/* ── Progress summary (Phase 5) ──────────────────────────────── */

// Best score (score/total as a ratio, tie-broken by score) per theme
// for a profile. Returns a map: { theme: { best, total } }.
export async function getBestScores(profile_id) {
  if (!profile_id) return {};
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('theme, score, total')
      .eq('profile_id', profile_id);
    if (error) throw error;
    const best = {};
    for (const s of data ?? []) {
      const cur = best[s.theme];
      const ratio = s.total ? s.score / s.total : 0;
      const curRatio = cur && cur.total ? cur.best / cur.total : -1;
      if (!cur || ratio > curRatio) best[s.theme] = { best: s.score, total: s.total };
    }
    return best;
  } catch (e) {
    console.warn('[db] getBestScores failed:', e);
    return {};
  }
}
