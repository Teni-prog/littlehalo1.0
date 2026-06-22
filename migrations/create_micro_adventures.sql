-- Create the micro_adventures table.
-- Run this in the Supabase SQL editor before seeding.

CREATE TABLE IF NOT EXISTS public.micro_adventures (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL UNIQUE, -- Added unique constraint to safely allow conflict detection
  description      TEXT,
  age_min          INTEGER,
  age_max          INTEGER,
  duration_minutes INTEGER,
  difficulty       TEXT        CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  subject          TEXT,
  special_needs_tags TEXT[]    DEFAULT '{}',
  materials        TEXT[]      DEFAULT '{}',
  instructions     TEXT,
  is_featured      BOOLEAN     DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Seed values with strict typing array structures
INSERT INTO public.micro_adventures 
  (name, description, age_min, age_max, duration_minutes, difficulty, subject, special_needs_tags, materials, instructions)
VALUES
  -- AGES 1-2
  ('Outdoor Water Play', 'Pour, splash and measure with containers outdoors or in the bathtub. Sitter narrates actions to build vocabulary.', 1, 2, 15, 'Easy', 'Sensory', ARRAY['Sensory-friendly'], ARRAY['Containers', 'Water'], 'Fill containers with water in a safe space. Supervise pouring/shaping.'),
  ('Ziplock Bag Painting', 'Seal paint inside a ziplock bag — child squishes and explores color mixing from outside. Zero mess guaranteed.', 1, 2, 15, 'Easy', 'Arts & Crafts', ARRAY['Sensory-friendly'], ARRAY['Ziplock bag', 'Paint'], 'Squeeze drops of paint inside the bag, seal with tape, tap to window/table, let child press.'),
  ('Shaker Instruments', 'Fill a sealed plastic bottle with rice to make a shaker. Explore rhythm and cause-and-effect through music play.', 1, 2, 10, 'Easy', 'Music', ARRAY['Sensory-friendly'], ARRAY['Plastic bottle', 'Rice', 'Tape'], 'Pour dry rice or beans into a clean small plastic bottle. Securely tape the lid shut.'),
  ('Stack & Sort Challenge', 'Stack and sort blocks, rings, or household objects with a guided script. Sitter narrates colors and shapes throughout.', 1, 2, 15, 'Easy', 'STEM', ARRAY[]::TEXT[], ARRAY['Blocks or stackable toys'], 'Sit floor-level. Encourage sorting patterns by size or primary color sets.'),
  ('Interactive Story Safari', 'Read a board book using animal sounds, gestures, and call-and-response. Child turns pages and points to pictures.', 1, 2, 15, 'Easy', 'Language', ARRAY['Autism-friendly'], ARRAY['Board book'], 'Pace reading with heavy sensory inflections and pointing routines.'),
  ('Sensory Nature Walk', 'Walk outdoors touching bark, grass, and stones. Sitter narrates textures and names everything. Take photos for parents.', 1, 2, 20, 'Easy', 'Outdoor', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Accompany child outside. Point to tree barks, smooth stones, safely checking elements.'),

  -- AGES 3-4
  ('Cardboard Rocket Ship', 'Build and decorate a cardboard box rocket ship with markers. Add a paper control panel and blast off.', 3, 4, 30, 'Medium', 'Arts & Crafts', ARRAY[]::TEXT[], ARRAY['Cardboard box', 'Markers', 'Paper'], 'Transform a wide box into a sit-in module. Guide drawing buttons and dashboard lines.'),
  ('Granola Balls', 'Make simple no-bake granola balls together. Teaches measuring, mixing, and following steps. Requires parent pre-approval for allergies.', 3, 4, 25, 'Easy', 'Cooking', ARRAY[]::TEXT[], ARRAY['Oats', 'Honey', 'Peanut butter'], 'Check allergy rules with parents. Combine items in a mixing bowl and roll out small spheres.'),
  ('Bug Hunt Journal', 'Search the garden for bugs with a magnifying glass and draw findings in a simple journal.', 3, 4, 30, 'Easy', 'Science', ARRAY[]::TEXT[], ARRAY['Magnifying glass', 'Paper', 'Pencil'], 'Find macro-insects safely under leaves. Draw lines or descriptive colors on scratchpad paper.'),
  ('Colour Mixing Experiment', 'Mix primary colors with paint or colored water to discover new colors. Predict and observe outcomes.', 3, 4, 20, 'Easy', 'Science', ARRAY['ADHD-friendly'], ARRAY['Paint or food coloring', 'Water', 'Cups'], 'Add water droplets to distinct clear cups. Slowly drip color sets to observe transitions.'),
  ('Dramatic Play: Restaurant', 'Set up a pretend restaurant with menus, orders, and cooking. Rotate roles between chef and customer.', 3, 4, 30, 'Easy', 'Social Skills', ARRAY[]::TEXT[], ARRAY['Paper', 'Toy food or real containers'], 'Design simple paper menus. Alternate order taker and client scripts with dramatic performance.'),
  ('Freeze Dance', 'Dance to music and freeze when it stops. Add body percussion — clapping, stomping patterns — for extra challenge.', 3, 4, 15, 'Easy', 'Music', ARRAY['ADHD-friendly'], ARRAY['Music player'], 'Play upbeat tracks. Stop unexpectedly and challenge freezing position poses.'),
  ('Seed in a Cup', 'Plant seeds in a clear cup against the side so roots are visible. Observe and sketch daily growth.', 3, 4, 20, 'Easy', 'Science', ARRAY[]::TEXT[], ARRAY['Clear cup', 'Soil', 'Seeds'], 'Plant seeds in a clear cup against the side so roots are visible. Observe and sketch daily growth.'),

  -- AGES 5-6
  ('Volcano Eruption', 'Build a baking soda and vinegar volcano. Predict what will happen, observe the reaction, and repeat with variations.', 5, 6, 30, 'Medium', 'Science', ARRAY['ADHD-friendly'], ARRAY['Baking soda', 'Vinegar', 'Cup', 'Tray'], 'Place plastic cup on a deep rimmed tray. Combine ingredients to observe foaming activity.'),
  ('Mini Book Author', 'Write and illustrate an original 8-page mini book. Fold a sheet of paper to create pages. Sitter helps with spelling.', 5, 6, 40, 'Medium', 'Language', ARRAY[]::TEXT[], ARRAY['Paper', 'Pencil', 'Crayons'], 'Fold paper sheets standard book wise. Form simple structural sub-plots together.'),
  ('Spaghetti Tower Challenge', 'Build the tallest freestanding tower using spaghetti and marshmallows. Plan, build, test, rebuild.', 5, 6, 30, 'Medium', 'STEM', ARRAY['ADHD-friendly'], ARRAY['Spaghetti', 'Marshmallows'], 'Construct base geometric shapes with individual strands and small nodes.'),
  ('Sock Puppet Show', 'Create sock puppets and perform an original story. Write a script first, then perform for an imaginary audience.', 5, 6, 45, 'Medium', 'Arts & Crafts', ARRAY[]::TEXT[], ARRAY['Old socks', 'Markers', 'Googly eyes'], 'Decorate clean spare clothes items. Arrange a behind-the-couch puppet staging arena.'),
  ('Community Kindness Cards', 'Make handwritten cards for neighbours, family members, or local workers. Discuss why kindness matters.', 5, 6, 30, 'Easy', 'Social Skills', ARRAY[]::TEXT[], ARRAY['Paper', 'Pencil', 'Crayons'], 'Illustrate small cards with colorful designs targeting close friends or internal family members.'),

  -- AGES 7-9
  ('Bridge Engineering Challenge', 'Build a bridge from index cards that can hold the most weight. Measure, test, and redesign.', 7, 9, 45, 'Hard', 'STEM', ARRAY[]::TEXT[], ARRAY['Index cards', 'Tape', 'Small weights'], 'Span index cards between gaps. Load objects incrementally to pinpoint failure zones.'),
  ('Stop Motion Animation', 'Create a 10-second stop motion video using clay or toys and a phone camera. Plan scenes before filming.', 7, 9, 60, 'Hard', 'Arts & Crafts', ARRAY[]::TEXT[], ARRAY['Phone or tablet', 'Clay or small toys'], 'Position toy models on flat surfaces. Take progressive incremental photo sets with device.'),
  ('Kitchen Chemistry', 'Test everyday substances (lemon juice, baking soda, milk) to identify acids and bases using red cabbage indicator.', 7, 9, 45, 'Medium', 'Science', ARRAY[]::TEXT[], ARRAY['Red cabbage', 'Lemon juice', 'Baking soda', 'Cups'], 'Drip extracted warm red cabbage broth over liquids to view color chemistry adjustments.'),
  ('Newspaper Reporter', 'Write and present a 1-minute news report about something that happened this week. Film it for parents.', 7, 9, 40, 'Medium', 'Language', ARRAY[]::TEXT[], ARRAY['Paper', 'Pencil', 'Phone for filming'], 'Draft high priority headlines from daily local activities. Set up static presentation frame.'),
  ('Code a Story in Scratch', 'Create an interactive story or simple game in Scratch. Plan characters and plot first on paper.', 7, 9, 60, 'Hard', 'Technology', ARRAY[]::TEXT[], ARRAY['Device with Scratch access'], 'Draft sprite positions manually on scratchpads before inputting loops on-screen.'),

  -- AGES 10-12
  ('Mini Business Plan', 'Design a simple business: name, product, price, target customer, marketing idea. Use the provided business plan template.', 10, 12, 60, 'Hard', 'STEM', ARRAY[]::TEXT[], ARRAY['Paper', 'Pencil'], 'Formulate micro-enterprise systems detailing material cost lines against sales tags.'),
  ('One-Minute Movie', 'Write a 3-scene script, film each scene, present the final cut. Sitter directs, child acts and operates camera.', 10, 12, 60, 'Hard', 'Arts & Crafts', ARRAY[]::TEXT[], ARRAY['Phone for filming'], 'Break concept paths explicitly into a concrete beginning, complex middle, and clean wrap-up.'),
  ('Dream Room Budget', 'Design your ideal bedroom and shop for furniture using a fake catalogue with prices. Stay within a budget.', 10, 12, 45, 'Medium', 'STEM', ARRAY[]::TEXT[], ARRAY['Paper', 'Pencil', 'Printed or drawn catalogue'], 'Set ceiling expense thresholds. Itemize furnishings cleanly on grid papers.'),
  ('Improv Comedy Workshop', 'Run 5 improv games: Yes And, Freeze, One-Word Story, Emotional Replay, and Superhero. Sitter facilitates each game.', 10, 12, 45, 'Medium', 'Social Skills', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Iterate quickly inside rapid situational configurations keeping strict rule constraints.'),
  ('Design a Solution', 'Pick a real local problem, research it briefly, and design a solution. Present with a poster or diagram.', 10, 12, 60, 'Hard', 'STEM', ARRAY[]::TEXT[], ARRAY['Paper', 'Pencil', 'Markers'], 'Select localized everyday pain points. Graph out iterative problem-solving fixes visual style.')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  age_min = EXCLUDED.age_min,
  age_max = EXCLUDED.age_max,
  duration_minutes = EXCLUDED.duration_minutes,
  difficulty = EXCLUDED.difficulty,
  subject = EXCLUDED.subject,
  special_needs_tags = EXCLUDED.special_needs_tags,
  materials = EXCLUDED.materials,
  instructions = EXCLUDED.instructions;

-- Execute specific updates to toggle platform features
UPDATE public.micro_adventures SET is_featured = false;
UPDATE public.micro_adventures SET is_featured = true WHERE name IN ('Volcano Eruption', 'Mini Business Plan', 'Cardboard Rocket Ship');
