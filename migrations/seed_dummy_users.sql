-- Seed data for demo authentication
-- This file contains hardcoded dummy user profiles for demonstration purposes

-- Insert Parent Users
INSERT INTO public.users (id, email, name, user_type, avatar) VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'sarah.johnson@example.com', 'Sarah Johnson', 'parent', 'https://i.pravatar.cc/150?img=1'),
  ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'michael.chen@example.com', 'Michael Chen', 'parent', 'https://i.pravatar.cc/150?img=2'),
  ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'emily.rodriguez@example.com', 'Emily Rodriguez', 'parent', 'https://i.pravatar.cc/150?img=3');

-- Insert Sitter Users
INSERT INTO public.users (id, email, name, user_type, avatar) VALUES
  ('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'alex.thompson@example.com', 'Alex Thompson', 'sitter', 'https://i.pravatar.cc/150?img=4'),
  ('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'jessica.martinez@example.com', 'Jessica Martinez', 'sitter', 'https://i.pravatar.cc/150?img=5'),
  ('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'david.kim@example.com', 'David Kim', 'sitter', 'https://i.pravatar.cc/150?img=6');

-- Insert Sitter Profiles
INSERT INTO public.sitter_profiles (id, user_id, bio, hourly_rate, languages, location, is_verified, rating, reviews_count, background_check_status) VALUES
  (
    'aa11bb22-cc33-dd44-ee55-ff6677889900',
    'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    'Experienced childcare provider with 5+ years working with children of all ages. CPR and First Aid certified. Love outdoor activities and creative play!',
    25,
    ARRAY['English', 'Spanish'],
    'Brooklyn, NY',
    true,
    4.8,
    12,
    'approved'
  ),
  (
    'bb22cc33-dd44-ee55-ff66-778899001122',
    'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    'Former elementary school teacher turned professional babysitter. Specializing in educational activities and homework help. Patient and nurturing!',
    30,
    ARRAY['English', 'French'],
    'Manhattan, NY',
    true,
    4.9,
    18,
    'approved'
  ),
  (
    'cc33dd44-ee55-ff66-7788-990011223344',
    'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    'Fun and energetic sitter who loves sports and games. Great with active kids! Background in child psychology and special needs care.',
    28,
    ARRAY['English', 'Korean'],
    'Queens, NY',
    true,
    4.7,
    9,
    'approved'
  );

-- Insert Children
INSERT INTO public.children (id, parent_id, name, age, special_needs) VALUES
  ('11223344-5566-7788-99aa-bbccddeeff00', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Emma Johnson', 5, ARRAY['Peanut allergy']),
  ('22334455-6677-8899-aabb-ccddeeff0011', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Liam Johnson', 3, NULL),
  ('33445566-7788-99aa-bbcc-ddeeff001122', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Sophia Chen', 7, NULL),
  ('44556677-8899-aabb-ccdd-eeff00112233', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Noah Rodriguez', 4, ARRAY['ADHD']),
  ('55667788-99aa-bbcc-ddee-ff0011223344', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Olivia Rodriguez', 6, NULL);

-- Insert Sessions
INSERT INTO public.sessions (id, parent_id, sitter_id, child_id, date, start_time, end_time, status, hourly_rate, address, adventure) VALUES
  (
    'a1111111-2222-3333-4444-555566667777',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    '11223344-5566-7788-99aa-bbccddeeff00',
    '2026-02-15',
    '14:00:00',
    '18:00:00',
    'confirmed',
    25,
    '123 Park Ave, Brooklyn, NY',
    'Playground visit and arts & crafts'
  ),
  (
    'b2222222-3333-4444-5555-666677778888',
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    '33445566-7788-99aa-bbcc-ddeeff001122',
    '2026-02-12',
    '15:00:00',
    '19:00:00',
    'completed',
    30,
    '456 Madison St, Manhattan, NY',
    'Museum visit and homework help'
  ),
  (
    'c3333333-4444-5555-6666-777788889999',
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    '44556677-8899-aabb-ccdd-eeff00112233',
    '2026-02-10',
    '10:00:00',
    '14:00:00',
    'completed',
    28,
    '789 Queens Blvd, Queens, NY',
    'Soccer practice and outdoor games'
  ),
  (
    'd4444444-5555-6666-7777-888899990000',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    '22334455-6677-8899-aabb-ccddeeff0011',
    '2026-02-20',
    '16:00:00',
    '20:00:00',
    'pending',
    30,
    '123 Park Ave, Brooklyn, NY',
    'Story time and dinner'
  ),
  (
    'e5555555-6666-7777-8888-999900001111',
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    '55667788-99aa-bbcc-ddee-ff0011223344',
    '2026-02-08',
    '13:00:00',
    '17:00:00',
    'completed',
    25,
    '789 Queens Blvd, Queens, NY',
    'Park adventure and snack time'
  ),
  (
    'f6666666-7777-8888-9999-000011112222',
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    '33445566-7788-99aa-bbcc-ddeeff001122',
    '2026-02-05',
    '09:00:00',
    '12:00:00',
    'cancelled',
    28,
    '456 Madison St, Manhattan, NY',
    'Morning activities'
  );

-- Insert Reviews
INSERT INTO public.reviews (id, session_id, parent_id, sitter_id, rating, comment) VALUES
  (
    'a1111111-2222-3333-4444-555566667777',
    'b2222222-3333-4444-5555-666677778888',
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    5,
    'Jessica was absolutely wonderful! My daughter loved the museum visit and she even helped with homework. Highly recommend!'
  ),
  (
    'b2222222-3333-4444-5555-666677778888',
    'c3333333-4444-5555-6666-777788889999',
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    5,
    'David was amazing with my son! He has so much energy and really knows how to keep active kids engaged. Will definitely book again!'
  ),
  (
    'c3333333-4444-5555-6666-777788889999',
    'e5555555-6666-7777-8888-999900001111',
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    4,
    'Alex did a great job! Very reliable and my daughter had fun. Only minor issue was running 10 minutes late, but otherwise perfect.'
  );
