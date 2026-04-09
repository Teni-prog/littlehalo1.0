-- Bookings table
-- Tracks a parent's booking request for a sitter.
-- Flow: pending_sitter → confirmed | declined
--       confirmed → completed | cancelled

CREATE TABLE public.bookings (
  id              UUID        NOT NULL DEFAULT gen_random_uuid(),
  parent_id       UUID        NOT NULL,
  sitter_id       UUID        NOT NULL,  -- references sitter_profiles.id
  date            DATE        NOT NULL,
  start_time      TIME        NOT NULL,
  end_time        TIME        NOT NULL,
  children        JSONB       NOT NULL DEFAULT '[]',  -- snapshot of child info at booking time
  adventure_id    UUID        NULL,
  notes           TEXT        NULL,
  total_amount    NUMERIC(8,2) NOT NULL DEFAULT 0,
  status          TEXT        NOT NULL DEFAULT 'pending_sitter',
  created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP   NOT NULL DEFAULT NOW(),

  CONSTRAINT bookings_pkey PRIMARY KEY (id),

  CONSTRAINT bookings_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES public.users (id) ON DELETE CASCADE,

  CONSTRAINT bookings_sitter_id_fkey
    FOREIGN KEY (sitter_id) REFERENCES public.sitter_profiles (id) ON DELETE CASCADE,

  CONSTRAINT bookings_status_check CHECK (
    status = ANY (ARRAY[
      'pending_sitter',   -- waiting for sitter to accept
      'confirmed',        -- sitter accepted
      'declined',         -- sitter declined
      'completed',        -- session finished
      'cancelled'         -- cancelled by either party
    ])
  )
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index for sitter dashboard query (fetch all bookings for a sitter)
CREATE INDEX bookings_sitter_id_idx ON public.bookings (sitter_id);

-- Index for parent dashboard query (fetch all bookings for a parent)
CREATE INDEX bookings_parent_id_idx ON public.bookings (parent_id);
