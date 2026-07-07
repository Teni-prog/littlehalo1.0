-- Create sitter_verifications table for the sitter identity/document verification flow.
-- Sitters submit personal details + ID documents + proof of address for manual review.
-- No third-party verification service is integrated — documents are stored privately in
-- Supabase Storage and reviewed by an admin (admin review UI is a future addition).

CREATE TABLE IF NOT EXISTS public.sitter_verifications (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id             UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  status                TEXT        NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'pending', 'approved', 'rejected')),
  full_legal_name       TEXT,
  date_of_birth         DATE,
  document_type         TEXT        CHECK (document_type IN ('passport', 'drivers_license', 'provincial_id')),
  document_front_url    TEXT,
  document_back_url     TEXT,
  proof_of_address_url  TEXT,
  submitted_at          TIMESTAMPTZ,
  reviewed_at           TIMESTAMPTZ,
  rejection_reason      TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.sitter_verifications ENABLE ROW LEVEL SECURITY;

-- A sitter can read only their own verification row
CREATE POLICY "sitters_read_own_verification"
  ON public.sitter_verifications FOR SELECT
  USING (auth.uid() = sitter_id);

-- A sitter can create their own verification row
CREATE POLICY "sitters_insert_own_verification"
  ON public.sitter_verifications FOR INSERT
  WITH CHECK (auth.uid() = sitter_id);

-- A sitter can only update their own row while it hasn't been submitted for review
-- (or after a rejection, to resubmit). Once 'pending' or 'approved', it's locked —
-- only an admin (via a future admin flow, using the service-role client which
-- bypasses RLS) can transition it further.
CREATE POLICY "sitters_update_own_verification"
  ON public.sitter_verifications FOR UPDATE
  USING (auth.uid() = sitter_id AND status IN ('incomplete', 'rejected'))
  WITH CHECK (auth.uid() = sitter_id);

CREATE INDEX IF NOT EXISTS sitter_verifications_status_idx ON public.sitter_verifications(status);

-- Private Storage bucket for verification documents (5MB limit, images + PDF only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Path convention: verification-documents/{sitter_id}/{field}-{timestamp}.{ext}
-- A sitter may upload/update only within their own folder (first path segment == their uid).
CREATE POLICY "sitters_upload_own_verification_docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "sitters_update_own_verification_docs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Read access: the sitter who owns the folder, or an admin user (user_type = 'admin').
-- No admin role exists in this app yet (user_type is currently 'parent' | 'sitter' only),
-- so this clause is a no-op until an admin role is introduced, but the requirement is
-- satisfied structurally now rather than needing a follow-up migration later.
CREATE POLICY "read_own_or_admin_verification_docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verification-documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin')
    )
  );
