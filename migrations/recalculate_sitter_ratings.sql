-- Recalculate rating and reviews_count for every sitter from real review data.
-- Run once after add_booking_id_to_reviews.sql has been applied.

UPDATE public.sitter_profiles sp
SET
  rating = (
    SELECT ROUND(AVG(r.rating)::numeric, 1)
    FROM public.reviews r
    WHERE r.sitter_id = sp.user_id
      AND r.reviewer_type = 'parent'
      AND r.booking_id IS NOT NULL
  ),
  reviews_count = (
    SELECT COUNT(*)
    FROM public.reviews r
    WHERE r.sitter_id = sp.user_id
      AND r.reviewer_type = 'parent'
      AND r.booking_id IS NOT NULL
  );
