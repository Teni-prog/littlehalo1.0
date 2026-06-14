-- Add missing columns to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS family_bio TEXT;

-- Add missing columns to sitter_profiles table
ALTER TABLE public.sitter_profiles
  ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS age_groups TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS special_needs_experience TEXT[] DEFAULT '{}';
