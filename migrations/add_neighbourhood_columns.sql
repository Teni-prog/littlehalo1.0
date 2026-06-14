-- Migration: add neighbourhood, latitude, longitude to sitter_profiles and parent profiles (users table)
-- Run this in the Supabase SQL editor

-- ── sitter_profiles ────────────────────────────────────────────────────────────
ALTER TABLE sitter_profiles
  ADD COLUMN IF NOT EXISTS neighbourhood text,
  ADD COLUMN IF NOT EXISTS latitude      double precision,
  ADD COLUMN IF NOT EXISTS longitude     double precision;

-- ── users (parent profiles) ───────────────────────────────────────────────────
-- Parents are stored in the users table; add the same three columns there.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS neighbourhood text,
  ADD COLUMN IF NOT EXISTS latitude      double precision,
  ADD COLUMN IF NOT EXISTS longitude     double precision;
