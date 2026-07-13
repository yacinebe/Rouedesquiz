-- ═══════════════════════════════════════════════════════════════
--  Migration 002 — richer profiles (T-05)
--  Adds first name / last name / date of birth to profiles.
--  Run once in the Supabase dashboard → SQL Editor. Idempotent.
--  (schema.sql carries the same shape for fresh installs.)
-- ═══════════════════════════════════════════════════════════════
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name  text,
  add column if not exists birthdate  date;

-- Backfill first_name from the old single `name` column for any existing rows,
-- then make `name` optional (first_name is the display field going forward).
update public.profiles set first_name = name where first_name is null and name is not null;
alter table public.profiles alter column name drop not null;
