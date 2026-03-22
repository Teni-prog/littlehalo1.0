// Unified and normalized mock data for micro-adventures and booking adventures.

const ACTIVITY_CATEGORY_DEFINITIONS = [
  { id: "all", name: "All Activities", icon: "Grid3x3" },
  {
    id: "arts",
    name: "Creative Arts",
    icon: "Palette",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "reading",
    name: "Reading & Language",
    icon: "BookOpen",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "stem",
    name: "STEM & Science",
    icon: "FlaskConical",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "active",
    name: "Active & Outdoor",
    icon: "TreePine",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "cultural",
    name: "Cultural & Heritage",
    icon: "Globe",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "logic",
    name: "Problem Solving",
    icon: "Puzzle",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "music",
    name: "Music & Movement",
    icon: "Music",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "cooking",
    name: "Cooking & Life Skills",
    icon: "ChefHat",
    color: "from-yellow-500 to-orange-500",
  },
];

const MICRO_ACTIVITY_RECORDS = [
  {
    id: "1",
    title: "Volcano Eruption",
    category: "stem",
    description:
      "Create a baking soda and vinegar volcano. Learn about chemical reactions through exciting eruptions!",
    fullDescription:
      "Build an erupting volcano using household materials and learn about chemical reactions, geology, and the scientific method. Kids will mix baking soda and vinegar to create a fizzing eruption while learning why it happens.",
    ageRange: "4-10 years",
    ageMin: 4,
    ageMax: 10,
    duration: "30-45 min",
    difficulty: "Beginner",
    learningGoals: [
      "Scientific reasoning",
      "Cause and effect",
      "Fine motor skills",
      "Following instructions",
    ],
    materials: [
      "Baking soda",
      "Vinegar",
      "Food coloring",
      "Plastic bottle",
      "Clay or playdough",
    ],
    messLevel: "Medium",
    popularity: 47,
    indoor: true,
    outdoor: false,
  },
  {
    id: "2",
    title: "Rainbow STEM Challenge",
    category: "stem",
    description:
      "Build structures using only colored materials. Combine engineering with color theory in this creative challenge.",
    fullDescription:
      "Design and build structures using materials of specific colors, teaching color recognition, engineering principles, and problem-solving. Each color has different properties (flexible, rigid, etc.)",
    ageRange: "5-12 years",
    ageMin: 5,
    ageMax: 12,
    duration: "45-60 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Engineering basics",
      "Color theory",
      "Problem solving",
      "Creative thinking",
    ],
    materials: [
      "Colored paper",
      "Pipe cleaners",
      "Popsicle sticks",
      "Tape",
      "Building blocks",
    ],
    messLevel: "Low",
    popularity: 32,
    indoor: true,
    outdoor: false,
  },
  {
    id: "3",
    title: "Kitchen Science Lab",
    category: "stem",
    description:
      "Turn the kitchen into a science lab with safe, edible experiments. Make slime, crystals, and more!",
    fullDescription:
      "Conduct safe kitchen science experiments using food items. Make rock candy crystals, create edible slime with cornstarch, and explore density with oil and water.",
    ageRange: "6-12 years",
    ageMin: 6,
    ageMax: 12,
    duration: "40-50 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Scientific method",
      "Observation skills",
      "States of matter",
      "Measurement",
    ],
    materials: [
      "Sugar",
      "Water",
      "Cornstarch",
      "Food coloring",
      "Oil",
      "Measuring cups",
    ],
    messLevel: "Medium",
    popularity: 38,
    indoor: true,
    outdoor: false,
  },
  {
    id: "4",
    title: "Bilingual Storytime",
    category: "reading",
    description:
      "Read classic stories in native language, then discuss in English. Maintain mother tongue while building English skills.",
    fullDescription:
      "Foster bilingual development by reading culturally relevant stories in the child's heritage language, then discussing themes, characters, and lessons in English. Strengthens both languages while building cultural pride.",
    ageRange: "2-8 years",
    ageMin: 2,
    ageMax: 8,
    duration: "20-30 min",
    difficulty: "Beginner",
    learningGoals: [
      "Bilingualism",
      "Listening comprehension",
      "Cultural connection",
      "Vocabulary",
    ],
    materials: ["Books in heritage language", "Comfortable reading space"],
    messLevel: "Low",
    popularity: 56,
    indoor: true,
    outdoor: false,
    specialFeature: "Available in 15+ languages",
  },
  {
    id: "5",
    title: "Create Your Own Story",
    category: "reading",
    description:
      "Write and illustrate an original story together. Develop writing skills, sequencing, and creativity.",
    fullDescription:
      "Guide children through the story creation process from brainstorming characters to illustrating their masterpiece. Learn story structure, character development, and narrative arc.",
    ageRange: "5-12 years",
    ageMin: 5,
    ageMax: 12,
    duration: "45-60 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Creative writing",
      "Sequencing",
      "Illustration",
      "Narrative structure",
    ],
    materials: [
      "Paper",
      "Pencils",
      "Crayons or markers",
      "Stapler for binding",
    ],
    messLevel: "Low",
    popularity: 41,
    indoor: true,
    outdoor: false,
  },
  {
    id: "6",
    title: "Poetry Workshop",
    category: "reading",
    description:
      "Experiment with haiku, acrostic, and rhyming poems. Express feelings through poetic language.",
    fullDescription:
      "Explore different poetry forms while learning about rhythm, rhyme, and creative expression. Children create multiple poems and compile them into a personal poetry book.",
    ageRange: "7-12 years",
    ageMin: 7,
    ageMax: 12,
    duration: "35-45 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Creative writing",
      "Rhythm and rhyme",
      "Self-expression",
      "Literary forms",
    ],
    materials: ["Paper", "Pencils", "Optional: decorative supplies"],
    messLevel: "Low",
    popularity: 28,
    indoor: true,
    outdoor: false,
  },
  {
    id: "7",
    title: "Nature Collage Creation",
    category: "arts",
    description:
      "Collect natural materials and create beautiful collages. Learn about textures, colors, and patterns in nature.",
    fullDescription:
      "Take a nature walk to collect leaves, flowers, twigs, and pebbles, then arrange them into artistic collages. Discuss textures, patterns, and the science of nature while creating art.",
    ageRange: "3-8 years",
    ageMin: 3,
    ageMax: 8,
    duration: "30-45 min",
    difficulty: "Beginner",
    learningGoals: [
      "Fine motor skills",
      "Nature appreciation",
      "Pattern recognition",
      "Creative expression",
    ],
    materials: [
      "Paper",
      "Glue",
      "Natural materials",
      "Optional: crayons for leaf rubbings",
    ],
    messLevel: "Medium",
    popularity: 52,
    indoor: false,
    outdoor: true,
  },
  {
    id: "8",
    title: "Cultural Art Traditions",
    category: "arts",
    description:
      "Explore art from your family's culture-paper cutting, rangoli patterns, mask-making, or geometric designs.",
    fullDescription:
      "Connect with heritage through traditional art forms. Choose from Chinese paper cutting, Indian rangoli, African masks, Islamic geometry, or other cultural traditions.",
    ageRange: "5-12 years",
    ageMin: 5,
    ageMax: 12,
    duration: "45-60 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Cultural identity",
      "Fine motor skills",
      "Historical awareness",
      "Pattern recognition",
    ],
    materials: [
      "Varies by tradition: paper, colored powder/sand, cardboard, paint",
    ],
    messLevel: "Medium",
    popularity: 44,
    indoor: true,
    outdoor: false,
    specialFeature: "Customizable to family heritage",
  },
  {
    id: "9",
    title: "Recycled Art Sculpture",
    category: "arts",
    description:
      "Transform recyclables into imaginative sculptures. Learn environmental responsibility through creativity.",
    fullDescription:
      "Build robots, animals, or abstract sculptures from cardboard boxes, bottles, and packaging. Teaches environmental awareness, 3D thinking, and resourcefulness.",
    ageRange: "4-10 years",
    ageMin: 4,
    ageMax: 10,
    duration: "45-60 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Environmental awareness",
      "3D thinking",
      "Resourcefulness",
      "Engineering basics",
    ],
    materials: [
      "Recyclables (boxes, bottles, egg cartons)",
      "Tape",
      "Glue",
      "Paint (optional)",
    ],
    messLevel: "Medium",
    popularity: 35,
    indoor: true,
    outdoor: false,
  },
  {
    id: "10",
    title: "Nature Scavenger Hunt",
    category: "active",
    description:
      "Follow clues to find natural items. Explore the outdoors while learning about local ecology.",
    fullDescription:
      "Hunt for specific leaves, rocks, colors, and textures in nature. Learn plant identification, animal tracking signs, and ecological concepts through active exploration.",
    ageRange: "3-10 years",
    ageMin: 3,
    ageMax: 10,
    duration: "30-45 min",
    difficulty: "Beginner",
    learningGoals: [
      "Nature observation",
      "Physical activity",
      "Following directions",
      "Ecology basics",
    ],
    materials: ["Scavenger hunt list", "Collection bag", "Outdoor space"],
    messLevel: "Low",
    popularity: 64,
    indoor: false,
    outdoor: true,
  },
  {
    id: "11",
    title: "Obstacle Course Challenge",
    category: "active",
    description:
      "Design and complete a custom obstacle course. Build gross motor skills and problem-solving.",
    fullDescription:
      "Children help design an obstacle course using household items or outdoor features, then time themselves completing it. Teaches planning, physical coordination, and personal achievement.",
    ageRange: "4-12 years",
    ageMin: 4,
    ageMax: 12,
    duration: "30-45 min",
    difficulty: "Beginner",
    learningGoals: [
      "Gross motor skills",
      "Planning",
      "Physical fitness",
      "Goal setting",
    ],
    materials: [
      "Household items for obstacles (cushions, boxes, rope)",
      "Timer",
    ],
    messLevel: "Low",
    popularity: 58,
    indoor: true,
    outdoor: true,
  },
  {
    id: "12",
    title: "Yoga & Mindfulness",
    category: "active",
    description:
      "Fun yoga poses and breathing exercises for kids. Learn body awareness and emotional regulation.",
    fullDescription:
      "Practice child-friendly yoga poses with creative names (tree, cat, warrior), combined with breathing exercises and mindfulness activities to support emotional regulation.",
    ageRange: "3-10 years",
    ageMin: 3,
    ageMax: 10,
    duration: "20-30 min",
    difficulty: "Beginner",
    learningGoals: [
      "Body awareness",
      "Emotional regulation",
      "Flexibility",
      "Mindfulness",
    ],
    materials: ["Yoga mat or soft surface", "Quiet space"],
    messLevel: "Low",
    popularity: 39,
    indoor: true,
    outdoor: true,
    specialFeature: "Excellent for calming and transitions",
  },
  {
    id: "13",
    title: "Cultural Cooking Together",
    category: "cultural",
    description:
      "Make traditional dishes from your heritage. Learn about culture through food, measurements, and traditions.",
    fullDescription:
      "Prepare simple cultural dishes (dumplings, chapati, empanadas, etc.) while learning about family traditions, measurements, following recipes, and cultural stories.",
    ageRange: "5-12 years",
    ageMin: 5,
    ageMax: 12,
    duration: "45-60 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Cultural identity",
      "Following recipes",
      "Measurements",
      "Life skills",
    ],
    materials: [
      "Recipe ingredients",
      "Cooking utensils",
      "Parent approval for kitchen use",
    ],
    messLevel: "High",
    popularity: 48,
    indoor: true,
    outdoor: false,
    specialFeature: "Customizable to any culture",
  },
  {
    id: "14",
    title: "World Music Exploration",
    category: "cultural",
    description:
      "Listen to music from different cultures, learn simple instruments, and explore rhythms from around the world.",
    fullDescription:
      "Explore musical traditions from various cultures using recordings, simple instruments, and rhythm games. Learn about musical diversity and cultural expression.",
    ageRange: "3-10 years",
    ageMin: 3,
    ageMax: 10,
    duration: "25-35 min",
    difficulty: "Beginner",
    learningGoals: [
      "Cultural awareness",
      "Rhythm and music",
      "Listening skills",
      "Movement",
    ],
    materials: [
      "Music player",
      "Simple instruments or homemade shakers",
      "Scarves for dancing",
    ],
    messLevel: "Low",
    popularity: 31,
    indoor: true,
    outdoor: false,
  },
  {
    id: "15",
    title: "Heritage Stories & Legends",
    category: "cultural",
    description:
      "Share folktales and legends from your family's culture. Connect with traditions through storytelling.",
    fullDescription:
      "Read or tell traditional stories, myths, and legends from the child's cultural background. Discuss themes, morals, and cultural values while building identity and pride.",
    ageRange: "4-12 years",
    ageMin: 4,
    ageMax: 12,
    duration: "20-30 min",
    difficulty: "Beginner",
    learningGoals: [
      "Cultural identity",
      "Listening comprehension",
      "Moral reasoning",
      "Heritage connection",
    ],
    materials: [
      "Cultural storybooks or oral traditions",
      "Comfortable seating",
    ],
    messLevel: "Low",
    popularity: 42,
    indoor: true,
    outdoor: false,
  },
  {
    id: "16",
    title: "Dance Party Freeze Game",
    category: "music",
    description:
      "Dance to various music styles, freezing when music stops. Build rhythm, listening skills, and self-control.",
    fullDescription:
      "Play music from different genres and cultures. When music stops, children freeze in creative poses. Develops listening skills, self-regulation, and cultural music appreciation.",
    ageRange: "2-8 years",
    ageMin: 2,
    ageMax: 8,
    duration: "15-25 min",
    difficulty: "Beginner",
    learningGoals: [
      "Self-regulation",
      "Listening skills",
      "Gross motor skills",
      "Cultural music",
    ],
    materials: ["Music player", "Open space for dancing"],
    messLevel: "Low",
    popularity: 67,
    indoor: true,
    outdoor: true,
  },
  {
    id: "17",
    title: "Homemade Instrument Band",
    category: "music",
    description:
      "Create instruments from household items and perform a concert. Learn about sound, rhythm, and creativity.",
    fullDescription:
      "Build shakers, drums, guitars, and other instruments from recyclables and household items. Learn about sound production, pitch, and rhythm while fostering creativity.",
    ageRange: "4-10 years",
    ageMin: 4,
    ageMax: 10,
    duration: "40-50 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Sound science",
      "Creativity",
      "Fine motor skills",
      "Rhythm",
    ],
    materials: [
      "Recyclables (boxes, bottles)",
      "Rice/beans",
      "Rubber bands",
      "Paper towel tubes",
    ],
    messLevel: "Medium",
    popularity: 45,
    indoor: true,
    outdoor: false,
  },
  {
    id: "18",
    title: "Puzzle Design Challenge",
    category: "logic",
    description:
      "Create custom puzzles for others to solve. Develop logical thinking and spatial reasoning.",
    fullDescription:
      "Design and create various types of puzzles: jigsaw, maze, riddles, or logic puzzles. Then challenge family members to solve them.",
    ageRange: "6-12 years",
    ageMin: 6,
    ageMax: 12,
    duration: "35-45 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Logical thinking",
      "Spatial reasoning",
      "Problem solving",
      "Creativity",
    ],
    materials: ["Paper", "Pencils", "Scissors", "Cardboard (for jigsaw)"],
    messLevel: "Low",
    popularity: 29,
    indoor: true,
    outdoor: false,
  },
  {
    id: "19",
    title: "Coding with No Screens",
    category: "logic",
    description:
      "Learn coding concepts through physical activities. Build computational thinking without technology.",
    fullDescription:
      "Use cards, floor grids, and movement to teach programming concepts like sequencing, loops, and conditionals. Foundation for future coding skills.",
    ageRange: "5-10 years",
    ageMin: 5,
    ageMax: 10,
    duration: "30-40 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Computational thinking",
      "Sequencing",
      "Problem solving",
      "Following algorithms",
    ],
    materials: [
      "Direction cards",
      "Grid markings (tape on floor)",
      "Objects to collect",
    ],
    messLevel: "Low",
    popularity: 36,
    indoor: true,
    outdoor: true,
  },
  {
    id: "20",
    title: "Healthy Snack Chef",
    category: "cooking",
    description:
      "Prepare nutritious snacks together. Learn about nutrition, measurements, and kitchen safety.",
    fullDescription:
      "Make simple, healthy snacks like fruit kabobs, veggie faces, or energy balls. Discuss nutrition, practice measuring, and learn safe kitchen practices.",
    ageRange: "4-10 years",
    ageMin: 4,
    ageMax: 10,
    duration: "25-35 min",
    difficulty: "Beginner",
    learningGoals: [
      "Nutrition awareness",
      "Measurements",
      "Kitchen safety",
      "Following directions",
    ],
    materials: [
      "Fruits/vegetables",
      "Measuring cups",
      "Child-safe utensils",
      "Plates",
    ],
    messLevel: "Medium",
    popularity: 53,
    indoor: true,
    outdoor: false,
  },
  {
    id: "21",
    title: "Money & Math Market",
    category: "cooking",
    description:
      "Set up a pretend store and practice money skills. Learn about currency, addition, and economics.",
    fullDescription:
      "Create a home store with real or play items, price tags, and play money. Practice making change, addition, and basic economic concepts through play.",
    ageRange: "5-10 years",
    ageMin: 5,
    ageMax: 10,
    duration: "30-40 min",
    difficulty: "Intermediate",
    learningGoals: [
      "Math skills",
      "Money concepts",
      "Addition/subtraction",
      "Real-world application",
    ],
    materials: [
      "Household items to sell",
      "Play money or real coins",
      "Price tags",
      "Shopping bag",
    ],
    messLevel: "Low",
    popularity: 37,
    indoor: true,
    outdoor: false,
  },
];

const BOOKING_ADVENTURE_RECORDS = [
  {
    id: "1",
    title: "Nature Explorer",
    description:
      "Discover the wonders of nature through outdoor exploration, bug hunts, and nature crafts",
    category: "Outdoor",
    ageRange: "3-8 years",
    duration: "2 hours",
    price: 35,
    difficulty: "Easy",
    image: "nature",
    activities: [
      "Nature scavenger hunt",
      "Leaf and flower collection",
      "Bug observation",
      "Nature journaling",
      "Outdoor art with natural materials",
    ],
    materials: [
      "Magnifying glass",
      "Collection bags",
      "Nature journal",
      "Crayons",
    ],
    learningGoals: [
      "Environmental awareness",
      "Observation skills",
      "Outdoor safety",
    ],
    sitterId: "1",
  },
  {
    id: "2",
    title: "Little Chef",
    description:
      "Learn basic cooking skills while making healthy and fun snacks together",
    category: "Culinary",
    ageRange: "4-10 years",
    duration: "1.5 hours",
    price: 40,
    difficulty: "Medium",
    image: "cooking",
    activities: [
      "Fruit kabobs creation",
      "Pizza making",
      "Cookie decorating",
      "Smoothie blending",
      "Kitchen safety basics",
    ],
    materials: [
      "Child-safe utensils",
      "Aprons",
      "Fresh ingredients",
      "Measuring cups",
    ],
    learningGoals: [
      "Cooking basics",
      "Healthy eating",
      "Following instructions",
      "Kitchen safety",
    ],
    sitterId: "1",
  },
  {
    id: "3",
    title: "Art Studio",
    description:
      "Express creativity through painting, drawing, and mixed media art projects",
    category: "Arts & Crafts",
    ageRange: "3-12 years",
    duration: "2 hours",
    price: 35,
    difficulty: "Easy",
    image: "art",
    activities: [
      "Watercolor painting",
      "Collage making",
      "Clay sculpting",
      "Drawing lessons",
      "Mixed media projects",
    ],
    materials: ["Paints", "Brushes", "Paper", "Clay", "Craft supplies"],
    learningGoals: [
      "Creative expression",
      "Fine motor skills",
      "Color theory",
      "Art appreciation",
    ],
    sitterId: "1",
  },
  {
    id: "4",
    title: "Sports Challenge",
    description: "Stay active with fun sports activities and team games",
    category: "Physical Activity",
    ageRange: "5-12 years",
    duration: "2 hours",
    price: 40,
    difficulty: "Medium",
    image: "sports",
    activities: [
      "Soccer drills",
      "Basketball skills",
      "Relay races",
      "Team building games",
      "Stretching and warm-up",
    ],
    materials: ["Sports balls", "Cones", "Water bottles", "First aid kit"],
    learningGoals: [
      "Physical fitness",
      "Teamwork",
      "Sportsmanship",
      "Coordination",
    ],
    sitterId: "2",
  },
  {
    id: "5",
    title: "Water Fun",
    description: "Enjoy safe water activities and swimming games",
    category: "Outdoor",
    ageRange: "4-10 years",
    duration: "2 hours",
    price: 45,
    difficulty: "Medium",
    image: "swimming",
    activities: [
      "Swimming games",
      "Water safety practice",
      "Pool noodle races",
      "Diving practice",
      "Water aerobics for kids",
    ],
    materials: ["Swimwear", "Floaties", "Pool toys", "Towels", "Sunscreen"],
    learningGoals: [
      "Swimming skills",
      "Water safety",
      "Confidence building",
      "Physical fitness",
    ],
    sitterId: "2",
  },
  {
    id: "7",
    title: "Music & Movement",
    description: "Explore rhythm, dance, and musical instruments",
    category: "Arts & Crafts",
    ageRange: "2-8 years",
    duration: "1 hour",
    price: 20,
    difficulty: "Easy",
    image: "music",
    activities: [
      "Rhythm games",
      "Instrument exploration",
      "Dance party",
      "Song learning",
      "Musical storytelling",
    ],
    materials: [
      "Simple instruments",
      "Music player",
      "Scarves",
      "Rhythm sticks",
    ],
    learningGoals: [
      "Musical awareness",
      "Rhythm",
      "Coordination",
      "Self-expression",
    ],
    sitterId: "3",
  },
  {
    id: "8",
    title: "Bilingual Storytime",
    description:
      "Immersive language learning through stories and songs in Spanish and English",
    category: "Educational",
    ageRange: "2-7 years",
    duration: "1 hour",
    price: 25,
    difficulty: "Easy",
    image: "reading",
    activities: [
      "Bilingual stories",
      "Spanish songs",
      "Vocabulary games",
      "Picture books",
      "Puppet shows",
    ],
    materials: ["Bilingual books", "Puppets", "Flashcards", "Music"],
    learningGoals: [
      "Language development",
      "Cultural awareness",
      "Listening skills",
      "Vocabulary",
    ],
    sitterId: "4",
  },
  {
    id: "9",
    title: "Science Lab",
    description: "Conduct safe and exciting science experiments",
    category: "STEM",
    ageRange: "5-12 years",
    duration: "2 hours",
    price: 45,
    difficulty: "Medium",
    image: "science",
    activities: [
      "Chemistry experiments",
      "Physics demonstrations",
      "Biology observations",
      "Scientific method practice",
      "Hypothesis testing",
    ],
    materials: [
      "Safe chemicals",
      "Lab equipment",
      "Safety goggles",
      "Science journal",
    ],
    learningGoals: [
      "Scientific thinking",
      "Observation",
      "Critical thinking",
      "Safety awareness",
    ],
    sitterId: "5",
  },
  {
    id: "10",
    title: "Building & Engineering",
    description:
      "Create amazing structures and learn basic engineering concepts",
    category: "STEM",
    ageRange: "4-10 years",
    duration: "1.5 hours",
    price: 38,
    difficulty: "Medium",
    image: "building",
    activities: [
      "LEGO challenges",
      "Bridge building",
      "Simple machines",
      "Robotics basics",
      "Design thinking",
    ],
    materials: [
      "LEGO sets",
      "Building blocks",
      "Craft materials",
      "Simple tools",
    ],
    learningGoals: [
      "Engineering concepts",
      "Problem-solving",
      "Creativity",
      "Spatial reasoning",
    ],
    sitterId: "5",
  },
  {
    id: "11",
    title: "Sensory Play",
    description: "Calming sensory activities designed for all abilities",
    category: "Special Needs",
    ageRange: "2-10 years",
    duration: "1 hour",
    price: 22,
    difficulty: "Easy",
    image: "sensory",
    activities: [
      "Sensory bins",
      "Tactile exploration",
      "Calming activities",
      "Visual stimulation",
      "Sound exploration",
    ],
    materials: [
      "Sensory materials",
      "Fidget tools",
      "Textured objects",
      "Soft lighting",
    ],
    learningGoals: [
      "Sensory regulation",
      "Exploration",
      "Calm focus",
      "Self-awareness",
    ],
    sitterId: "6",
  },
  {
    id: "12",
    title: "Adventure Hike",
    description:
      "Explore local trails with fun hiking games and nature challenges",
    category: "Outdoor",
    ageRange: "6-12 years",
    duration: "3 hours",
    price: 60,
    difficulty: "Hard",
    image: "hiking",
    activities: [
      "Trail hiking",
      "Navigation basics",
      "Wildlife spotting",
      "Outdoor survival skills",
      "Photography walk",
    ],
    materials: ["Backpacks", "Water bottles", "Snacks", "First aid kit", "Map"],
    learningGoals: [
      "Physical endurance",
      "Nature appreciation",
      "Navigation",
      "Outdoor safety",
    ],
    sitterId: "8",
  },
];

const LEGACY_BOOKING_TO_MICRO_CATEGORY = {
  Outdoor: "active",
  "Physical Activity": "active",
  Culinary: "cooking",
  "Arts & Crafts": "arts",
  Educational: "reading",
  STEM: "stem",
  "Special Needs": "logic",
};

const LEGACY_DIFFICULTY_TO_MICRO_DIFFICULTY = {
  Easy: "Beginner",
  Medium: "Intermediate",
  Hard: "Advanced",
};

const DEFAULT_PRICE_BY_CATEGORY = {
  stem: 32,
  reading: 24,
  arts: 28,
  active: 26,
  cultural: 30,
  music: 25,
  logic: 27,
  cooking: 29,
};

const BOOKING_ADDON_PRICE_BY_ACTIVITY_ID = {
  1: 35,
  4: 25,
  7: 30,
  10: 28,
  20: 22,
};

function withActivityPrice(activity) {
  if (typeof activity.price === "number") {
    return activity;
  }

  const mappedPrice =
    BOOKING_ADDON_PRICE_BY_ACTIVITY_ID[activity.id] ??
    DEFAULT_PRICE_BY_CATEGORY[activity.category] ??
    20;

  return {
    ...activity,
    price: mappedPrice,
  };
}

function parseAgeRange(ageRange) {
  const match = /([0-9]+)\s*-\s*([0-9]+)/.exec(ageRange || "");
  if (!match) {
    return { ageMin: 2, ageMax: 12 };
  }

  return {
    ageMin: Number(match[1]),
    ageMax: Number(match[2]),
  };
}

function normalizeLegacyBookingAdventureForLibrary(record) {
  const { ageMin, ageMax } = parseAgeRange(record.ageRange);
  const mappedCategory =
    LEGACY_BOOKING_TO_MICRO_CATEGORY[record.category] || "active";
  const mappedDifficulty =
    LEGACY_DIFFICULTY_TO_MICRO_DIFFICULTY[record.difficulty] || "Beginner";
  const isOutdoorCategory =
    record.category === "Outdoor" || record.category === "Physical Activity";

  return {
    id: `legacy-${record.id}`,
    title: record.title,
    category: mappedCategory,
    description: record.description,
    fullDescription: record.description,
    ageRange: record.ageRange,
    ageMin,
    ageMax,
    duration: record.duration,
    difficulty: mappedDifficulty,
    learningGoals: record.learningGoals || [],
    materials: record.materials || [],
    messLevel: "Low",
    popularity: 20,
    indoor: !isOutdoorCategory,
    outdoor: isOutdoorCategory,
    price: record.price,
    specialFeature: "Also available from booking options",
  };
}

const PRICED_MICRO_ACTIVITY_RECORDS =
  MICRO_ACTIVITY_RECORDS.map(withActivityPrice);

const LIBRARY_ACTIVITY_RECORDS = [
  ...PRICED_MICRO_ACTIVITY_RECORDS,
  ...BOOKING_ADVENTURE_RECORDS.map(
    normalizeLegacyBookingAdventureForLibrary,
  ).map(withActivityPrice),
];

function toEntityMap(records) {
  return records.reduce((acc, record) => {
    acc[record.id] = record;
    return acc;
  }, {});
}

function groupIdsBy(records, key) {
  return records.reduce((acc, record) => {
    const groupKey = record[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(record.id);
    return acc;
  }, {});
}

export const microActivityById = toEntityMap(PRICED_MICRO_ACTIVITY_RECORDS);
export const microActivityIds = PRICED_MICRO_ACTIVITY_RECORDS.map(
  (record) => record.id,
);
export const microActivityIdsByCategory = groupIdsBy(
  PRICED_MICRO_ACTIVITY_RECORDS,
  "category",
);

export const libraryActivityById = toEntityMap(LIBRARY_ACTIVITY_RECORDS);
export const libraryActivityIds = LIBRARY_ACTIVITY_RECORDS.map(
  (record) => record.id,
);
export const libraryActivityIdsByCategory = groupIdsBy(
  LIBRARY_ACTIVITY_RECORDS,
  "category",
);

export const bookingAdventureById = toEntityMap(BOOKING_ADVENTURE_RECORDS);
export const bookingAdventureIds = BOOKING_ADVENTURE_RECORDS.map(
  (record) => record.id,
);

// Backward-compatible denormalized exports for existing UI components.
export const mockActivities = microActivityIds.map(
  (id) => microActivityById[id],
);
export const adventures = bookingAdventureIds.map(
  (id) => bookingAdventureById[id],
);

export const activityCategories = ACTIVITY_CATEGORY_DEFINITIONS.map(
  (category) => {
    const count =
      category.id === "all"
        ? libraryActivityIds.length
        : (libraryActivityIdsByCategory[category.id] || []).length;

    return {
      ...category,
      count,
    };
  },
);

export function getActivitiesByCategory(categoryId) {
  if (categoryId === "all") {
    return libraryActivityIds.map((id) => libraryActivityById[id]);
  }

  const ids = libraryActivityIdsByCategory[categoryId] || [];
  return ids.map((id) => libraryActivityById[id]);
}

export function getActivitiesByAge(age) {
  const ageValue = Number(age);
  return libraryActivityIds
    .map((id) => libraryActivityById[id])
    .filter(
      (activity) => ageValue >= activity.ageMin && ageValue <= activity.ageMax,
    );
}

export function getMicroActivities({ categoryId = "all", age = "all" } = {}) {
  const byCategory = getActivitiesByCategory(categoryId);
  if (age === "all") {
    return byCategory;
  }

  const ageValue = Number(age);
  return byCategory.filter(
    (activity) => ageValue >= activity.ageMin && ageValue <= activity.ageMax,
  );
}

export function getLibraryActivityById(activityId) {
  return libraryActivityById[String(activityId)] || null;
}

export function searchActivities(query) {
  const lowerQuery = query.toLowerCase();
  return libraryActivityIds
    .map((id) => libraryActivityById[id])
    .filter(
      (activity) =>
        activity.title.toLowerCase().includes(lowerQuery) ||
        activity.description.toLowerCase().includes(lowerQuery) ||
        activity.learningGoals.some((goal) =>
          goal.toLowerCase().includes(lowerQuery),
        ),
    );
}

const BOOKING_MICRO_ACTIVITY_IDS = ["1", "4", "7", "10", "20"];

function toBookingOption(activity) {
  return {
    ...activity,
    price: BOOKING_ADDON_PRICE_BY_ACTIVITY_ID[activity.id] ?? 20,
  };
}

export function getBookingAdventures({ limit } = {}) {
  const bookingOptions = BOOKING_MICRO_ACTIVITY_IDS.map(
    (id) => microActivityById[id],
  )
    .filter(Boolean)
    .map(toBookingOption);

  if (!limit) {
    return bookingOptions;
  }

  return bookingOptions.slice(0, limit);
}

export function getBookingAdventureById(adventureId) {
  const bookingOptions = getBookingAdventures();
  return (
    bookingOptions.find((adventure) => adventure.id === String(adventureId)) ||
    null
  );
}
