-- Add adventure_name as a plain-text column so the adventure title selected
-- during booking can be stored without requiring a UUID foreign key.
-- The existing adventure_id UUID column is retained for backward compatibility.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS adventure_name TEXT;
