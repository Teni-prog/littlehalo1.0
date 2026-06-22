const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to manually load .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove surrounding quotes if any
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let usingAdmin = true;

if (!supabaseKey || supabaseKey === 'your_service_role_key_here') {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set or has placeholder value. Falling back to public publishable key.');
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  usingAdmin = false;
}

if (!supabaseUrl) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL is not configured.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ACTIVITIES = [
  // AGES 1-2
  {
    name: 'Outdoor Water Play',
    description: 'Pour, splash and measure with containers outdoors or in the bathtub. Sitter narrates actions to build vocabulary.',
    age_min: 1,
    age_max: 2,
    duration_minutes: 15,
    difficulty: 'Easy',
    subject: 'Sensory',
    special_needs_tags: ['Sensory-friendly'],
    materials: ['Containers', 'Water'],
    instructions: 'Fill containers with water in a safe space. Supervise pouring/shaping.',
    is_featured: false
  },
  {
    name: 'Ziplock Bag Painting',
    description: 'Seal paint inside a ziplock bag — child squishes and explores color mixing from outside. Zero mess guaranteed.',
    age_min: 1,
    age_max: 2,
    duration_minutes: 15,
    difficulty: 'Easy',
    subject: 'Arts & Crafts',
    special_needs_tags: ['Sensory-friendly'],
    materials: ['Ziplock bag', 'Paint'],
    instructions: 'Squeeze drops of paint inside the bag, seal with tape, tap to window/table, let child press.',
    is_featured: false
  },
  {
    name: 'Shaker Instruments',
    description: 'Fill a sealed plastic bottle with rice to make a shaker. Explore rhythm and cause-and-effect through music play.',
    age_min: 1,
    age_max: 2,
    duration_minutes: 10,
    difficulty: 'Easy',
    subject: 'Music',
    special_needs_tags: ['Sensory-friendly'],
    materials: ['Plastic bottle', 'Rice', 'Tape'],
    instructions: 'Pour dry rice or beans into a clean small plastic bottle. Securely tape the lid shut.',
    is_featured: false
  },
  {
    name: 'Stack & Sort Challenge',
    description: 'Stack and sort blocks, rings, or household objects with a guided script. Sitter narrates colors and shapes throughout.',
    age_min: 1,
    age_max: 2,
    duration_minutes: 15,
    difficulty: 'Easy',
    subject: 'STEM',
    special_needs_tags: [],
    materials: ['Blocks or stackable toys'],
    instructions: 'Sit floor-level. Encourage sorting patterns by size or primary color sets.',
    is_featured: false
  },
  {
    name: 'Interactive Story Safari',
    description: 'Read a board book using animal sounds, gestures, and call-and-response. Child turns pages and points to pictures.',
    age_min: 1,
    age_max: 2,
    duration_minutes: 15,
    difficulty: 'Easy',
    subject: 'Language',
    special_needs_tags: ['Autism-friendly'],
    materials: ['Board book'],
    instructions: 'Pace reading with heavy sensory inflections and pointing routines.',
    is_featured: false
  },
  {
    name: 'Sensory Nature Walk',
    description: 'Walk outdoors touching bark, grass, and stones. Sitter narrates textures and names everything. Take photos for parents.',
    age_min: 1,
    age_max: 2,
    duration_minutes: 20,
    difficulty: 'Easy',
    subject: 'Outdoor',
    special_needs_tags: [],
    materials: [],
    instructions: 'Accompany child outside. Point to tree barks, smooth stones, safely checking elements.',
    is_featured: false
  },

  // AGES 3-4
  {
    name: 'Cardboard Rocket Ship',
    description: 'Build and decorate a cardboard box rocket ship with markers. Add a paper control panel and blast off.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 30,
    difficulty: 'Medium',
    subject: 'Arts & Crafts',
    special_needs_tags: [],
    materials: ['Cardboard box', 'Markers', 'Paper'],
    instructions: 'Transform a wide box into a sit-in module. Guide drawing buttons and dashboard lines.',
    is_featured: true
  },
  {
    name: 'Granola Balls',
    description: 'Make simple no-bake granola balls together. Teaches measuring, mixing, and following steps. Requires parent pre-approval for allergies.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 25,
    difficulty: 'Easy',
    subject: 'Cooking',
    special_needs_tags: [],
    materials: ['Oats', 'Honey', 'Peanut butter'],
    instructions: 'Check allergy rules with parents. Combine items in a mixing bowl and roll out small spheres.',
    is_featured: false
  },
  {
    name: 'Bug Hunt Journal',
    description: 'Search the garden for bugs with a magnifying glass and draw findings in a simple journal.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 30,
    difficulty: 'Easy',
    subject: 'Science',
    special_needs_tags: [],
    materials: ['Magnifying glass', 'Paper', 'Pencil'],
    instructions: 'Find macro-insects safely under leaves. Draw lines or descriptive colors on scratchpad paper.',
    is_featured: false
  },
  {
    name: 'Colour Mixing Experiment',
    description: 'Mix primary colors with paint or colored water to discover new colors. Predict and observe outcomes.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 20,
    difficulty: 'Easy',
    subject: 'Science',
    special_needs_tags: ['ADHD-friendly'],
    materials: ['Paint or food coloring', 'Water', 'Cups'],
    instructions: 'Add water droplets to distinct clear cups. Slowly drip color sets to observe transitions.',
    is_featured: false
  },
  {
    name: 'Dramatic Play: Restaurant',
    description: 'Set up a pretend restaurant with menus, orders, and cooking. Rotate roles between chef and customer.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 30,
    difficulty: 'Easy',
    subject: 'Social Skills',
    special_needs_tags: [],
    materials: ['Paper', 'Toy food or real containers'],
    instructions: 'Design simple paper menus. Alternate order taker and client scripts with dramatic performance.',
    is_featured: false
  },
  {
    name: 'Freeze Dance',
    description: 'Dance to music and freeze when it stops. Add body percussion — clapping, stomping patterns — for extra challenge.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 15,
    difficulty: 'Easy',
    subject: 'Music',
    special_needs_tags: ['ADHD-friendly'],
    materials: ['Music player'],
    instructions: 'Play upbeat tracks. Stop unexpectedly and challenge freezing position poses.',
    is_featured: false
  },
  {
    name: 'Seed in a Cup',
    description: 'Plant seeds in a clear cup against the side so roots are visible. Observe and sketch daily growth.',
    age_min: 3,
    age_max: 4,
    duration_minutes: 20,
    difficulty: 'Easy',
    subject: 'Science',
    special_needs_tags: [],
    materials: ['Clear cup', 'Soil', 'Seeds'],
    instructions: 'Plant seeds in a clear cup against the side so roots are visible. Observe and sketch daily growth.',
    is_featured: false
  },

  // AGES 5-6
  {
    name: 'Volcano Eruption',
    description: 'Build a baking soda and vinegar volcano. Predict what will happen, observe the reaction, and repeat with variations.',
    age_min: 5,
    age_max: 6,
    duration_minutes: 30,
    difficulty: 'Medium',
    subject: 'Science',
    special_needs_tags: ['ADHD-friendly'],
    materials: ['Baking soda', 'Vinegar', 'Cup', 'Tray'],
    instructions: 'Place plastic cup on a deep rimmed tray. Combine ingredients to observe foaming activity.',
    is_featured: true
  },
  {
    name: 'Mini Book Author',
    description: 'Write and illustrate an original 8-page mini book. Fold a sheet of paper to create pages. Sitter helps with spelling.',
    age_min: 5,
    age_max: 6,
    duration_minutes: 40,
    difficulty: 'Medium',
    subject: 'Language',
    special_needs_tags: [],
    materials: ['Paper', 'Pencil', 'Crayons'],
    instructions: 'Fold paper sheets standard book wise. Form simple structural sub-plots together.',
    is_featured: false
  },
  {
    name: 'Spaghetti Tower Challenge',
    description: 'Build the tallest freestanding tower using spaghetti and marshmallows. Plan, build, test, rebuild.',
    age_min: 5,
    age_max: 6,
    duration_minutes: 30,
    difficulty: 'Medium',
    subject: 'STEM',
    special_needs_tags: ['ADHD-friendly'],
    materials: ['Spaghetti', 'Marshmallows'],
    instructions: 'Construct base geometric shapes with individual strands and small nodes.',
    is_featured: false
  },
  {
    name: 'Sock Puppet Show',
    description: 'Create sock puppets and perform an original story. Write a script first, then perform for an imaginary audience.',
    age_min: 5,
    age_max: 6,
    duration_minutes: 45,
    difficulty: 'Medium',
    subject: 'Arts & Crafts',
    special_needs_tags: [],
    materials: ['Old socks', 'Markers', 'Googly eyes'],
    instructions: 'Decorate clean spare clothes items. Arrange a behind-the-couch puppet staging arena.',
    is_featured: false
  },
  {
    name: 'Community Kindness Cards',
    description: 'Make handwritten cards for neighbours, family members, or local workers. Discuss why kindness matters.',
    age_min: 5,
    age_max: 6,
    duration_minutes: 30,
    difficulty: 'Easy',
    subject: 'Social Skills',
    special_needs_tags: [],
    materials: ['Paper', 'Pencil', 'Crayons'],
    instructions: 'Illustrate small cards with colorful designs targeting close friends or internal family members.',
    is_featured: false
  },

  // AGES 7-9
  {
    name: 'Bridge Engineering Challenge',
    description: 'Build a bridge from index cards that can hold the most weight. Measure, test, and redesign.',
    age_min: 7,
    age_max: 9,
    duration_minutes: 45,
    difficulty: 'Hard',
    subject: 'STEM',
    special_needs_tags: [],
    materials: ['Index cards', 'Tape', 'Small weights'],
    instructions: 'Span index cards between gaps. Load objects incrementally to pinpoint failure zones.',
    is_featured: false
  },
  {
    name: 'Stop Motion Animation',
    description: 'Create a 10-second stop motion video using clay or toys and a phone camera. Plan scenes before filming.',
    age_min: 7,
    age_max: 9,
    duration_minutes: 60,
    difficulty: 'Hard',
    subject: 'Arts & Crafts',
    special_needs_tags: [],
    materials: ['Phone or tablet', 'Clay or small toys'],
    instructions: 'Position toy models on flat surfaces. Take progressive incremental photo sets with device.',
    is_featured: false
  },
  {
    name: 'Kitchen Chemistry',
    description: 'Test everyday substances (lemon juice, baking soda, milk) to identify acids and bases using red cabbage indicator.',
    age_min: 7,
    age_max: 9,
    duration_minutes: 45,
    difficulty: 'Medium',
    subject: 'Science',
    special_needs_tags: [],
    materials: ['Red cabbage', 'Lemon juice', 'Baking soda', 'Cups'],
    instructions: 'Drip extracted warm red cabbage broth over liquids to view color chemistry adjustments.',
    is_featured: false
  },
  {
    name: 'Newspaper Reporter',
    description: 'Write and present a 1-minute news report about something that happened this week. Film it for parents.',
    age_min: 7,
    age_max: 9,
    duration_minutes: 40,
    difficulty: 'Medium',
    subject: 'Language',
    special_needs_tags: [],
    materials: ['Paper', 'Pencil', 'Phone for filming'],
    instructions: 'Draft high priority headlines from daily local activities. Set up static presentation frame.',
    is_featured: false
  },
  {
    name: 'Code a Story in Scratch',
    description: 'Create an interactive story or simple game in Scratch. Plan characters and plot first on paper.',
    age_min: 7,
    age_max: 9,
    duration_minutes: 60,
    difficulty: 'Hard',
    subject: 'Technology',
    special_needs_tags: [],
    materials: ['Device with Scratch access'],
    instructions: 'Draft sprite positions manually on scratchpads before inputting loops on-screen.',
    is_featured: false
  },

  // AGES 10-12
  {
    name: 'Mini Business Plan',
    description: 'Design a simple business: name, product, price, target customer, marketing idea. Use the provided business plan template.',
    age_min: 10,
    age_max: 12,
    duration_minutes: 60,
    difficulty: 'Hard',
    subject: 'STEM',
    special_needs_tags: [],
    materials: ['Paper', 'Pencil'],
    instructions: 'Formulate micro-enterprise systems detailing material cost lines against sales tags.',
    is_featured: true
  },
  {
    name: 'One-Minute Movie',
    description: 'Write a 3-scene script, film each scene, present the final cut. Sitter directs, child acts and operates camera.',
    age_min: 10,
    age_max: 12,
    duration_minutes: 60,
    difficulty: 'Hard',
    subject: 'Arts & Crafts',
    special_needs_tags: [],
    materials: ['Phone for filming'],
    instructions: 'Break concept paths explicitly into a concrete beginning, complex middle, and clean wrap-up.',
    is_featured: false
  },
  {
    name: 'Dream Room Budget',
    description: 'Design your ideal bedroom and shop for furniture using a fake catalogue with prices. Stay within a budget.',
    age_min: 10,
    age_max: 12,
    duration_minutes: 45,
    difficulty: 'Medium',
    subject: 'STEM',
    special_needs_tags: [],
    materials: ['Paper', 'Pencil', 'Printed or drawn catalogue'],
    instructions: 'Set ceiling expense thresholds. Itemize furnishings cleanly on grid papers.',
    is_featured: false
  },
  {
    name: 'Improv Comedy Workshop',
    description: 'Run 5 improv games: Yes And, Freeze, One-Word Story, Emotional Replay, and Superhero. Sitter facilitates each game.',
    age_min: 10,
    age_max: 12,
    duration_minutes: 45,
    difficulty: 'Medium',
    subject: 'Social Skills',
    special_needs_tags: [],
    materials: [],
    instructions: 'Iterate quickly inside rapid situational configurations keeping strict rule constraints.',
    is_featured: false
  },
  {
    name: 'Design a Solution',
    description: 'Pick a real local problem, research it briefly, and design a solution. Present with a poster or diagram.',
    age_min: 10,
    age_max: 12,
    duration_minutes: 60,
    difficulty: 'Hard',
    subject: 'STEM',
    special_needs_tags: [],
    materials: ['Paper', 'Pencil', 'Markers'],
    instructions: 'Select localized everyday pain points. Graph out iterative problem-solving fixes visual style.',
    is_featured: false
  }
];

async function seed() {
  if (!usingAdmin) {
    console.error('\nERROR: Cannot seed database without a valid SUPABASE_SERVICE_ROLE_KEY.');
    console.error('Please configure SUPABASE_SERVICE_ROLE_KEY in your .env.local file with a valid service role key from your Supabase project dashboard.');
    console.error('Alternatively, you can copy the SQL contents of migrations/create_micro_adventures.sql and run them in the Supabase Dashboard SQL Editor directly.\n');
    process.exit(1);
  }

  console.log(`Upserting ${ACTIVITIES.length} activities into micro_adventures table...`);
  const { data: inserted, error: upsertErr } = await supabase
    .from('micro_adventures')
    .upsert(ACTIVITIES, { onConflict: 'name' })
    .select();

  if (upsertErr) {
    console.error('Error seeding records:', upsertErr);
    process.exit(1);
  }

  console.log(`Successfully upserted ${inserted.length} activities!`);

  // Ensure featured state is clean and accurate
  console.log('Enforcing featured flag toggles...');
  const { error: resetErr } = await supabase
    .from('micro_adventures')
    .update({ is_featured: false })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to target all

  if (resetErr) {
    console.error('Error resetting is_featured flags:', resetErr);
  }

  const { error: updateErr } = await supabase
    .from('micro_adventures')
    .update({ is_featured: true })
    .in('name', ['Volcano Eruption', 'Mini Business Plan', 'Cardboard Rocket Ship']);

  if (updateErr) {
    console.error('Error setting featured activities:', updateErr);
  } else {
    console.log('Successfully completed seeding & featured toggles!');
  }
}

seed();
