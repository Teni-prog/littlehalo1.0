-- Extend reviews to support booking-based reviews and dual-party feedback.
-- reviewer_type: 'parent' = parent reviewed the sitter (shown on sitter profile/dashboard)
--               'sitter'  = sitter gave feedback about the family

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS booking_id UUID
    REFERENCES public.bookings(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS reviewer_type TEXT DEFAULT 'parent'
    CHECK (reviewer_type IN ('parent', 'sitter'));

-- Prevent either party submitting more than one review per booking
CREATE UNIQUE INDEX IF NOT EXISTS reviews_booking_reviewer_unique
  ON public.reviews (booking_id, reviewer_type)
  WHERE booking_id IS NOT NULL;
