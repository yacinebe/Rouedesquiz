-- ═══════════════════════════════════════════════════════════════
--  QuizRoulette v2 — Supabase schema + Row-Level Security
--  Run this once in the Supabase dashboard → SQL Editor.
--  Idempotent: safe to re-run.
--
--  Security model: the browser uses the PUBLIC publishable/anon key.
--  RLS (not key secrecy) is what protects data — every policy below
--  scopes rows to the signed-in user via auth.uid().
-- ═══════════════════════════════════════════════════════════════

-- ── profiles ──────────────────────────────────────────────────
-- One row per child. Owned by the (anonymous) auth user on the device.
create table if not exists public.profiles (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null,
  avatar     text,
  created_at timestamptz not null default now()
);

-- ── questions ─────────────────────────────────────────────────
-- Shared content bank (seeded from questions.js). Readable by any
-- signed-in user; written only by a seed/migration script (service role).
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  theme         text not null,
  difficulty    int  not null,
  question      text not null,
  options       jsonb not null,          -- array of 4 strings
  answer        text not null,           -- must equal one of options
  image         text,                    -- optional URL
  option_images jsonb,                   -- optional array of 4 image URLs
  legacy_id     text unique,             -- e.g. 'math-001' from questions.js, for idempotent upsert
  created_at    timestamptz not null default now()
);

create index if not exists questions_theme_idx on public.questions (theme);

-- ── attempts ──────────────────────────────────────────────────
-- One row per answered question. owner denormalized for simple RLS.
create table if not exists public.attempts (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  question_id uuid references public.questions (id) on delete set null,  -- null for static-bank questions
  theme       text not null,
  difficulty  int,
  is_correct  boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists attempts_profile_idx on public.attempts (profile_id, answered_at desc);

-- ── sessions ──────────────────────────────────────────────────
-- One row per completed 3-question round.
create table if not exists public.sessions (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  theme      text not null,
  score      int  not null,
  total      int  not null,
  played_at  timestamptz not null default now()
);

create index if not exists sessions_profile_idx on public.sessions (profile_id, played_at desc);

-- ═══════════════════════════════════════════════════════════════
--  Row-Level Security
-- ═══════════════════════════════════════════════════════════════
alter table public.profiles  enable row level security;
alter table public.questions enable row level security;
alter table public.attempts  enable row level security;
alter table public.sessions  enable row level security;

-- profiles: full CRUD, only your own rows
drop policy if exists "profiles_owner_all" on public.profiles;
create policy "profiles_owner_all" on public.profiles
  for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

-- questions: read-only to any signed-in user (incl. anonymous auth)
drop policy if exists "questions_read" on public.questions;
create policy "questions_read" on public.questions
  for select to authenticated
  using (true);

-- attempts: full CRUD, only your own rows
drop policy if exists "attempts_owner_all" on public.attempts;
create policy "attempts_owner_all" on public.attempts
  for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

-- sessions: full CRUD, only your own rows
drop policy if exists "sessions_owner_all" on public.sessions;
create policy "sessions_owner_all" on public.sessions
  for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());
