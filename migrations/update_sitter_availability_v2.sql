-- Update sitter_profiles to support recurring and override-based availability
-- Also add completed_sessions_count to track sessions separately from reviews

ALTER TABLE public.sitter_profiles
  ADD COLUMN IF NOT EXISTS recurring_availability JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS repeat_weekly BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS availability_overrides JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS completed_sessions_count INTEGER DEFAULT 0;

-- Migrate existing availability data (if any) to new recurring_availability format
-- The new format is hourly: { monday: { "06": true, "07": true, ... }, ... } where keys are 24-hour format (00-23) as strings

COMMENT ON COLUMN public.sitter_profiles.recurring_availability IS 'JSONB object storing hourly recurring availability schedule for each day. Format: {day: {"06": true, "07": true, ... }} where keys are hours in 24-hour format as strings.';
COMMENT ON COLUMN public.sitter_profiles.repeat_weekly IS 'Boolean flag: whether the recurring_availability pattern repeats every week or applies only once.';
COMMENT ON COLUMN public.sitter_profiles.availability_overrides IS 'JSONB object storing date-specific (YYYY-MM-DD format) hourly availability overrides. Format same as recurring_availability but keyed by date.';
COMMENT ON COLUMN public.sitter_profiles.completed_sessions_count IS 'Incremented whenever a booking status changes to completed, regardless of review submission.';

