create table public.children (
  id uuid not null default gen_random_uuid (),
  parent_id uuid null,
  name text not null,
  age integer null,
  special_needs text[] null,
  created_at timestamp without time zone null default now(),
  constraint children_pkey primary key (id),
  constraint children_parent_id_fkey foreign KEY (parent_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;