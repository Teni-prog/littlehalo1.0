create table public.sessions (
  id uuid not null default gen_random_uuid (),
  parent_id uuid null,
  sitter_id uuid null,
  child_id uuid null,
  date date not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  status text null,
  hourly_rate integer null,
  address text null,
  adventure text null,
  created_at timestamp without time zone null default now(),
  constraint sessions_pkey primary key (id),
  constraint sessions_child_id_fkey foreign KEY (child_id) references children (id),
  constraint sessions_parent_id_fkey foreign KEY (parent_id) references users (id),
  constraint sessions_sitter_id_fkey foreign KEY (sitter_id) references users (id),
  constraint sessions_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'confirmed'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;