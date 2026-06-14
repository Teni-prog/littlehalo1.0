-- Columns required by the redesigned multi-step sitter signup form.
-- Run this after add_missing_columns.sql.

ALTER TABLE public.sitter_profiles
  ADD COLUMN IF NOT EXISTS certifications TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability   JSONB   DEFAULT '{}';

-- Unique index on user_id so upsert (onConflict: 'user_id') works correctly
-- and prevents duplicate profiles per sitter.
CREATE UNIQUE INDEX IF NOT EXISTS sitter_profiles_user_id_unique
  ON public.sitter_profiles (user_id);
