-- Create reports table for issue reporting system
-- Used to track issues reported by parents and sitters on completed bookings

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('no-show', 'safety-concern', 'payment-issue', 'other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-review', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Anyone can read reports for bookings they're involved in (parent or sitter)
CREATE POLICY "users_read_own_booking_reports"
  ON public.reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id
      AND (parent_id = auth.uid() OR sitter_id IN (
        SELECT id FROM public.sitter_profiles
        WHERE user_id = auth.uid()
      ))
    )
  );

-- Authenticated users can insert reports for bookings they're involved in
CREATE POLICY "users_insert_own_reports"
  ON public.reports FOR INSERT
  WITH CHECK (
    auth.uid() = reporter_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id
      AND (parent_id = auth.uid() OR sitter_id IN (
        SELECT id FROM public.sitter_profiles
        WHERE user_id = auth.uid()
      ))
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS reports_booking_id_idx ON public.reports(booking_id);
CREATE INDEX IF NOT EXISTS reports_reporter_id_idx ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);
