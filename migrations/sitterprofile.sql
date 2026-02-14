create table public.sitter_profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  bio text null,
  hourly_rate integer null,
  languages text[] null,
  location text null,
  is_verified boolean null default false,
  rating numeric(2, 1) null,
  reviews_count integer null default 0,
  background_check_status text null,
  created_at timestamp without time zone null default now(),
  constraint sitter_profiles_pkey primary key (id),
  constraint sitter_profiles_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint sitter_profiles_background_check_status_check check (
    (
      background_check_status = any (
        array[
          'pending'::text,
          'approved'::text,
          'rejected'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;