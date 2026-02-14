create table public.reviews (
  id uuid not null default gen_random_uuid (),
  session_id uuid null,
  parent_id uuid null,
  sitter_id uuid null,
  rating integer null,
  comment text null,
  created_at timestamp without time zone null default now(),
  constraint reviews_pkey primary key (id),
  constraint reviews_parent_id_fkey foreign KEY (parent_id) references users (id),
  constraint reviews_session_id_fkey foreign KEY (session_id) references sessions (id),
  constraint reviews_sitter_id_fkey foreign KEY (sitter_id) references users (id),
  constraint reviews_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;