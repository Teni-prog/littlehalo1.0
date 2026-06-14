-- reviews_v2.sql
-- Replaces the old reviews table with a richer schema supporting
-- dual-party reviews (parent→sitter, sitter→family), separate
-- session/adventure ratings, and a would_rebook signal.
--
-- ⚠ Drops the old reviews table. Run only in development unless
--   you have migrated existing rows to the new shape first.

DROP TABLE IF EXISTS public.reviews CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.reviews (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id          UUID        NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id         UUID        NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
  reviewee_id         UUID        NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
  reviewer_role       TEXT        NOT NULL CHECK (reviewer_role IN ('parent', 'sitter')),
  session_rating      INTEGER     NOT NULL CHECK (session_rating BETWEEN 1 AND 5),
  adventure_rating    INTEGER              CHECK (adventure_rating BETWEEN 1 AND 5),
  review_text         TEXT,
  would_rebook        BOOLEAN,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submission_deadline TIMESTAMPTZ NOT NULL,
  UNIQUE (booking_id, reviewer_role)
);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read parent→sitter reviews (shown publicly on sitter profiles)
CREATE POLICY "parent_reviews_public_read"
  ON public.reviews FOR SELECT
  USING (reviewer_role = 'parent');

-- Sitters can read feedback they personally wrote about families
CREATE POLICY "sitters_read_own_written_feedback"
  ON public.reviews FOR SELECT
  USING (reviewer_role = 'sitter' AND auth.uid() = reviewer_id);

-- Parents can read sitter feedback written about their family
CREATE POLICY "parents_read_feedback_about_them"
  ON public.reviews FOR SELECT
  USING (reviewer_role = 'sitter' AND auth.uid() = reviewee_id);

-- Authenticated users can insert a review only when:
--   1. They are the declared reviewer
--   2. The linked booking is completed
--   3. The submission window is still open
CREATE POLICY "authenticated_insert_reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id
      AND   status = 'completed'
    )
    AND submission_deadline > NOW()
  );
