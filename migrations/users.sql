-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL,
  avatar TEXT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
  
  -- New preference columns
  max_budget INTEGER,
  preferred_languages TEXT[],
  preferred_location TEXT,
  
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_user_type_check CHECK (
    user_type = ANY (ARRAY['parent'::TEXT, 'sitter'::TEXT])
  )
) TABLESPACE pg_default;

-- Add default preferences to ALL parent users (separate statement)
UPDATE users 
SET 
  max_budget = 30,
  preferred_languages = ARRAY['English'],
  preferred_location = 'Fredericton, NB'
WHERE user_type = 'parent';