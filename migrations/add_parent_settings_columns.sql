-- Adds columns required by the /settings/parent page.
-- Run in Supabase SQL Editor before using the settings page.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS country      TEXT,
  ADD COLUMN IF NOT EXISTS budget_min   INTEGER,
  ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}';

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS medical_notes TEXT;
