-- Backfill sitter_profiles coordinates
-- Run this once in the Supabase SQL editor.
--
-- Step 1 — for any sitter that already has a neighbourhood name,
--           derive lat/lng from the known neighbourhood lookup table.
-- Step 2 — for any sitter that still has no coordinates after step 1,
--           distribute them across Fredericton/Moncton/Halifax neighbourhoods
--           so the parent-dashboard map shows useful demo pins.

-- ── Step 1: derive from neighbourhood name ─────────────────────────────────────
WITH hood_coords (name, lat, lng) AS (
  VALUES
    ('Silverwood',               45.9402,  -66.6066),
    ('Skyline Acres',            45.9524,  -66.5791),
    ('Sunshine Gardens',         45.9505,  -66.5905),
    ('Pepper Creek',             45.9440,  -66.6030),
    ('Barkers Point',            45.9612,  -66.6838),
    ('Devon',                    45.9734,  -66.6532),
    ('Northside',                45.9788,  -66.6341),
    ('Downtown',                 45.9636,  -66.6431),
    ('Brookside',                45.9312,  -66.6244),
    ('Lincoln',                  45.8933,  -66.5949),
    ('Downtown Moncton',         46.0878,  -64.7782),
    ('Dieppe',                   46.0831,  -64.7187),
    ('Riverview',                46.0594,  -64.7897),
    ('Magnetic Hill',            46.1238,  -64.8553),
    ('Uptown Saint John',        45.2733,  -66.0633),
    ('East Saint John',          45.2580,  -65.9996),
    ('West Saint John',          45.2660,  -66.0925),
    ('South End (Saint John)',   45.2612,  -66.0714),
    ('Miramichi',                47.0196,  -65.4969),
    ('Bathurst',                 47.6197,  -65.6506),
    ('Edmundston',               47.3769,  -68.3253),
    ('Campbellton',              47.9948,  -66.6728),
    ('Sussex',                   45.7270,  -65.5113),
    ('Woodstock',                46.1520,  -67.5706),
    ('Sackville',                45.8978,  -64.3728),
    ('Downtown Halifax',         44.6488,  -63.5752),
    ('Dartmouth',                44.6658,  -63.5669),
    ('Bedford',                  44.7327,  -63.6566),
    ('Cole Harbour',             44.6805,  -63.5097),
    ('Sackville (NS)',           44.7716,  -63.6930),
    ('Spryfield',                44.6062,  -63.6200),
    ('Clayton Park',             44.6800,  -63.6600),
    ('Sydney',                   46.1368,  -60.1942),
    ('Glace Bay',                46.1985,  -59.9573),
    ('New Waterford',            46.2419,  -60.0711),
    ('Truro',                    45.3647,  -63.2579),
    ('New Glasgow',              45.5924,  -62.6468),
    ('Amherst',                  45.8291,  -64.2107),
    ('Yarmouth',                 43.8367,  -66.1175),
    ('Kentville',                45.0773,  -64.4950),
    ('Bridgewater',              44.3767,  -64.5208),
    ('Antigonish',               45.6239,  -61.9958),
    ('Windsor (NS)',             44.9966,  -64.1317),
    ('Downtown Charlottetown',   46.2382,  -63.1311),
    ('Stratford',                46.2244,  -63.0877),
    ('Sherwood',                 46.2644,  -63.1272),
    ('Summerside',               46.3936,  -63.7898),
    ('Cornwall (PEI)',           46.2211,  -63.2044),
    ('Montague',                 46.1670,  -62.6478),
    ('Downtown St. John''s',     47.5615,  -52.7126),
    ('Mount Pearl',              47.5193,  -52.8058),
    ('Conception Bay South',     47.5127,  -52.9972),
    ('Paradise',                 47.5335,  -52.8780),
    ('Torbay',                   47.6629,  -52.7378),
    ('Gander',                   48.9569,  -54.6089),
    ('Corner Brook',             48.9500,  -57.9500),
    ('Grand Falls-Windsor',      48.9311,  -55.6648),
    ('Labrador City',            52.9428,  -66.9177),
    ('Happy Valley-Goose Bay',   53.3037,  -60.3311)
)
UPDATE sitter_profiles sp
SET
  latitude  = hc.lat,
  longitude = hc.lng
FROM hood_coords hc
WHERE sp.neighbourhood = hc.name
  AND (sp.latitude IS NULL OR sp.longitude IS NULL);

-- ── Step 2: assign demo coordinates to any sitter still missing them ───────────
-- Distributes remaining sitters across Fredericton-area neighbourhoods
-- using row_number() so each gets a distinct pin.
WITH unlocated AS (
  SELECT id,
         row_number() OVER (ORDER BY id) AS rn
  FROM sitter_profiles
  WHERE latitude IS NULL OR longitude IS NULL
),
demo_coords (rn, lat, lng, neighbourhood) AS (
  VALUES
    (1,  45.9636, -66.6431, 'Downtown'),
    (2,  45.9402, -66.6066, 'Silverwood'),
    (3,  45.9524, -66.5791, 'Skyline Acres'),
    (4,  45.9734, -66.6532, 'Devon'),
    (5,  45.9788, -66.6341, 'Northside'),
    (6,  45.9612, -66.6838, 'Barkers Point'),
    (7,  45.9312, -66.6244, 'Brookside'),
    (8,  45.9505, -66.5905, 'Sunshine Gardens'),
    (9,  45.9440, -66.6030, 'Pepper Creek'),
    (10, 45.8933, -66.5949, 'Lincoln')
)
UPDATE sitter_profiles sp
SET
  latitude      = dc.lat,
  longitude     = dc.lng,
  neighbourhood = COALESCE(sp.neighbourhood, dc.neighbourhood)
FROM unlocated u
JOIN demo_coords dc ON ((u.rn - 1) % 10 + 1 = dc.rn)
WHERE sp.id = u.id;
