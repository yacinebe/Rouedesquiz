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

export async function getProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar, created_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.warn('[db] getProfiles failed:', e);
    return [];
  }
}

export async function createProfile(name, avatar = null) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ name, avatar })
      .select('id, name, avatar')
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('[db] createProfile failed:', e);
    return null;
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
