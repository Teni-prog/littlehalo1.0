-- Update RLS policy to allow review submission without deadline check
-- Drop the old policy that enforced the deadline
DROP POLICY IF EXISTS authenticated_insert_reviews ON public.reviews;

-- Create new policy without deadline requirement
CREATE POLICY "authenticated_insert_reviews_no_deadline"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id
      AND status = 'completed'
    )
  );

-- Now it's safe to remove the deadline column
ALTER TABLE public.reviews
  DROP COLUMN IF EXISTS submission_deadline;