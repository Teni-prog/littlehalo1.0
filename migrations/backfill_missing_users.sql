-- Backfill: create public.users rows for any auth users that are missing one.
-- Run this once after applying auto_create_user_on_signup.sql.

INSERT INTO public.users (id, email, name, user_type)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1), 'User'),
  COALESCE(au.raw_user_meta_data->>'user_type', 'parent')
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
