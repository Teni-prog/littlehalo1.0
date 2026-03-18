export const sitters = [
  {
    id: '1',
    name: 'Emily Chen',
    title: 'Early Childhood Education Professional',
    bio: "Hello! I'm Emily, a passionate and experienced childcare provider with over 5 years of professional experience working with children of all ages. I hold an Early Childhood Education (ECE) certification and am certified in First Aid and CPR. I believe in creating a nurturing, safe, and engaging environment where children can learn and grow. I love incorporating educational activities, arts and crafts, outdoor play, and creative storytelling into my care. I'm fluent in both English and Mandarin, which allows me to provide bilingual care if desired.",
    avatar: 'EC',
    rating: 4.9,
    reviewCount: 42,
    totalBookings: 127,
    experience: 5,
    location: 'Halifax, NS',
    hourlyRate: 22,
    isVerified: true,
    responseRate: 95,
    responseTime: '< 1 hour',
    certifications: [
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'ECE Certified', icon: 'Award' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['Mandarin', 'English'],
    ageGroups: ['Infants (0-12m)', 'Toddlers (1-3y)', 'Preschool (3-5y)'],
    skills: [
      'Meal Preparation',
      'Light Housework',
      'Homework Help',
      'Transportation',
      'Arts & Crafts',
      'Outdoor Activities'
    ],
    availability: {
      monday: { available: true, times: '9:00 AM - 6:00 PM' },
      tuesday: { available: true, times: '9:00 AM - 6:00 PM' },
      wednesday: { available: true, times: '9:00 AM - 6:00 PM' },
      thursday: { available: true, times: '9:00 AM - 6:00 PM' },
      friday: { available: true, times: '9:00 AM - 3:00 PM' },
      saturday: { available: false, times: '' },
      sunday: { available: false, times: '' }
    },
    adventureIds: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    title: 'Experienced Childcare Provider',
    bio: "Hi there! I'm Marcus, and I've been caring for children for the past 8 years. I'm a father of two and understand the importance of quality childcare. I specialize in active play and outdoor adventures, ensuring kids stay engaged and healthy. Safety is my top priority, and I'm certified in First Aid, CPR, and Water Safety.",
    avatar: 'MT',
    rating: 4.8,
    reviewCount: 38,
    totalBookings: 94,
    experience: 8,
    location: 'Dartmouth, NS',
    hourlyRate: 20,
    isVerified: true,
    responseRate: 92,
    responseTime: '< 2 hours',
    certifications: [
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Water Safety', icon: 'ShieldCheck' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English', 'French'],
    ageGroups: ['Toddlers (1-3y)', 'Preschool (3-5y)', 'School Age (6-12y)'],
    skills: [
      'Outdoor Activities',
      'Sports & Games',
      'Swimming',
      'Transportation',
      'Meal Preparation'
    ],
    availability: {
      monday: { available: true, times: '3:00 PM - 8:00 PM' },
      tuesday: { available: true, times: '3:00 PM - 8:00 PM' },
      wednesday: { available: true, times: '3:00 PM - 8:00 PM' },
      thursday: { available: true, times: '3:00 PM - 8:00 PM' },
      friday: { available: true, times: '3:00 PM - 9:00 PM' },
      saturday: { available: true, times: '10:00 AM - 6:00 PM' },
      sunday: { available: true, times: '12:00 PM - 6:00 PM' }
    },
    adventureIds: ['4', '5']
  },
  {
    id: '3',
    name: 'Sarah Mitchell',
    title: 'Certified Montessori Teacher',
    bio: "Hello families! I'm Sarah, a certified Montessori teacher with 6 years of experience in early childhood education. I believe in child-led learning and fostering independence through hands-on activities. I create enriching experiences that support each child's unique developmental journey.",
    avatar: 'SM',
    rating: 5.0,
    reviewCount: 29,
    totalBookings: 68,
    experience: 6,
    location: 'Halifax, NS',
    hourlyRate: 25,
    isVerified: true,
    responseRate: 98,
    responseTime: '< 30 minutes',
    certifications: [
      { name: 'Montessori Certified', icon: 'Award' },
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'ECE Certified', icon: 'Award' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English'],
    ageGroups: ['Toddlers (1-3y)', 'Preschool (3-5y)'],
    skills: [
      'Montessori Activities',
      'Arts & Crafts',
      'Music & Dance',
      'Reading & Literacy',
      'Meal Preparation'
    ],
    availability: {
      monday: { available: true, times: '8:00 AM - 5:00 PM' },
      tuesday: { available: true, times: '8:00 AM - 5:00 PM' },
      wednesday: { available: true, times: '8:00 AM - 5:00 PM' },
      thursday: { available: true, times: '8:00 AM - 5:00 PM' },
      friday: { available: true, times: '8:00 AM - 12:00 PM' },
      saturday: { available: false, times: '' },
      sunday: { available: false, times: '' }
    },
    adventureIds: ['6', '7']
  },
  {
    id: '4',
    name: 'Jessica Rodriguez',
    title: 'Bilingual Nanny',
    bio: "¡Hola! I'm Jessica, a bilingual childcare provider fluent in Spanish and English. I have 4 years of experience and love introducing children to new languages and cultures through play and storytelling. I'm patient, creative, and deeply committed to providing a safe and loving environment.",
    avatar: 'JR',
    rating: 4.7,
    reviewCount: 31,
    totalBookings: 52,
    experience: 4,
    location: 'Halifax, NS',
    hourlyRate: 21,
    isVerified: true,
    responseRate: 90,
    responseTime: '< 1 hour',
    certifications: [
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['Spanish', 'English'],
    ageGroups: ['Infants (0-12m)', 'Toddlers (1-3y)', 'Preschool (3-5y)'],
    skills: [
      'Bilingual Care',
      'Meal Preparation',
      'Arts & Crafts',
      'Music & Dance',
      'Light Housework'
    ],
    availability: {
      monday: { available: true, times: '7:00 AM - 6:00 PM' },
      tuesday: { available: true, times: '7:00 AM - 6:00 PM' },
      wednesday: { available: false, times: '' },
      thursday: { available: true, times: '7:00 AM - 6:00 PM' },
      friday: { available: true, times: '7:00 AM - 6:00 PM' },
      saturday: { available: true, times: '9:00 AM - 2:00 PM' },
      sunday: { available: false, times: '' }
    },
    adventureIds: ['8']
  },
  {
    id: '5',
    name: 'David Kim',
    title: 'STEM-Focused Educator',
    bio: "Hi! I'm David, an engineer-turned-educator who loves sparking curiosity in young minds. With 3 years of childcare experience, I incorporate science experiments, building projects, and problem-solving activities into playtime. I'm great with school-age children and homework help!",
    avatar: 'DK',
    rating: 4.9,
    reviewCount: 24,
    totalBookings: 45,
    experience: 3,
    location: 'Bedford, NS',
    hourlyRate: 23,
    isVerified: true,
    responseRate: 94,
    responseTime: '< 1 hour',
    certifications: [
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English', 'Korean'],
    ageGroups: ['Preschool (3-5y)', 'School Age (6-12y)'],
    skills: [
      'Homework Help',
      'STEM Activities',
      'Problem Solving',
      'Transportation',
      'Meal Preparation'
    ],
    availability: {
      monday: { available: true, times: '3:00 PM - 7:00 PM' },
      tuesday: { available: true, times: '3:00 PM - 7:00 PM' },
      wednesday: { available: true, times: '3:00 PM - 7:00 PM' },
      thursday: { available: true, times: '3:00 PM - 7:00 PM' },
      friday: { available: true, times: '3:00 PM - 7:00 PM' },
      saturday: { available: true, times: '10:00 AM - 4:00 PM' },
      sunday: { available: false, times: '' }
    },
    adventureIds: ['9', '10']
  },
  {
    id: '6',
    name: 'Amanda Bennett',
    title: 'Special Needs Caregiver',
    bio: "Hello! I'm Amanda, specializing in care for children with special needs. I have 7 years of experience and training in autism spectrum support, sensory processing, and behavioral management. Every child deserves patient, understanding, and individualized care.",
    avatar: 'AB',
    rating: 5.0,
    reviewCount: 19,
    totalBookings: 41,
    experience: 7,
    location: 'Halifax, NS',
    hourlyRate: 28,
    isVerified: true,
    responseRate: 97,
    responseTime: '< 30 minutes',
    certifications: [
      { name: 'Special Needs Training', icon: 'Award' },
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Behavioral Management', icon: 'Award' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English'],
    ageGroups: ['Toddlers (1-3y)', 'Preschool (3-5y)', 'School Age (6-12y)'],
    skills: [
      'Special Needs Care',
      'Sensory Activities',
      'Behavioral Support',
      'Meal Preparation',
      'Light Housework'
    ],
    availability: {
      monday: { available: true, times: '9:00 AM - 4:00 PM' },
      tuesday: { available: true, times: '9:00 AM - 4:00 PM' },
      wednesday: { available: true, times: '9:00 AM - 4:00 PM' },
      thursday: { available: true, times: '9:00 AM - 4:00 PM' },
      friday: { available: false, times: '' },
      saturday: { available: false, times: '' },
      sunday: { available: false, times: '' }
    },
    adventureIds: ['11']
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    title: 'Infant Care Specialist',
    bio: "Hi families! I'm Lisa, specializing in infant and newborn care with 5 years of experience. I'm trained in safe sleep practices, bottle feeding, and developmental milestones. I provide gentle, loving care that gives parents peace of mind.",
    avatar: 'LA',
    rating: 4.8,
    reviewCount: 26,
    totalBookings: 58,
    experience: 5,
    location: 'Dartmouth, NS',
    hourlyRate: 24,
    isVerified: true,
    responseRate: 93,
    responseTime: '< 1 hour',
    certifications: [
      { name: 'Infant Care Certified', icon: 'Award' },
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Safe Sleep Training', icon: 'Award' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English'],
    ageGroups: ['Infants (0-12m)', 'Toddlers (1-3y)'],
    skills: [
      'Infant Care',
      'Bottle Feeding',
      'Sleep Training',
      'Diaper Changes',
      'Light Housework'
    ],
    availability: {
      monday: { available: true, times: '8:00 AM - 5:00 PM' },
      tuesday: { available: true, times: '8:00 AM - 5:00 PM' },
      wednesday: { available: true, times: '8:00 AM - 5:00 PM' },
      thursday: { available: true, times: '8:00 AM - 5:00 PM' },
      friday: { available: true, times: '8:00 AM - 5:00 PM' },
      saturday: { available: false, times: '' },
      sunday: { available: false, times: '' }
    },
    adventureIds: []
  },
  {
    id: '8',
    name: "Ryan O'Connor",
    title: 'Active Play Specialist',
    bio: "Hey! I'm Ryan, a former youth sports coach who brings energy and fun to every session. I have 4 years of childcare experience and love getting kids active through games, sports, and outdoor adventures. Let's make exercise fun!",
    avatar: 'RO',
    rating: 4.7,
    reviewCount: 33,
    totalBookings: 61,
    experience: 4,
    location: 'Halifax, NS',
    hourlyRate: 19,
    isVerified: true,
    responseRate: 88,
    responseTime: '< 2 hours',
    certifications: [
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Coaching License', icon: 'Award' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English'],
    ageGroups: ['Preschool (3-5y)', 'School Age (6-12y)'],
    skills: [
      'Sports & Games',
      'Outdoor Activities',
      'Team Building',
      'Physical Fitness',
      'Transportation'
    ],
    availability: {
      monday: { available: false, times: '' },
      tuesday: { available: true, times: '4:00 PM - 8:00 PM' },
      wednesday: { available: true, times: '4:00 PM - 8:00 PM' },
      thursday: { available: true, times: '4:00 PM - 8:00 PM' },
      friday: { available: true, times: '4:00 PM - 8:00 PM' },
      saturday: { available: true, times: '9:00 AM - 5:00 PM' },
      sunday: { available: true, times: '9:00 AM - 5:00 PM' }
    },
    adventureIds: ['12']
  },
  {
    id: '9',
    name: 'Priya Patel',
    title: 'Registered Nurse & Nanny',
    bio: "Namaste! I'm Priya, a registered nurse with 6 years of pediatric experience who transitioned to childcare. My medical background allows me to provide exceptional care, especially for children with medical needs or chronic conditions. I'm calm, competent, and caring.",
    avatar: 'PP',
    rating: 5.0,
    reviewCount: 17,
    totalBookings: 34,
    experience: 6,
    location: 'Bedford, NS',
    hourlyRate: 30,
    isVerified: true,
    responseRate: 99,
    responseTime: '< 15 minutes',
    certifications: [
      { name: 'Registered Nurse', icon: 'Award' },
      { name: 'Pediatric Care', icon: 'Award' },
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    ageGroups: ['Infants (0-12m)', 'Toddlers (1-3y)', 'Preschool (3-5y)', 'School Age (6-12y)'],
    skills: [
      'Medical Care',
      'Medication Administration',
      'First Aid',
      'Meal Preparation',
      'Light Housework'
    ],
    availability: {
      monday: { available: true, times: '7:00 AM - 3:00 PM' },
      tuesday: { available: true, times: '7:00 AM - 3:00 PM' },
      wednesday: { available: true, times: '7:00 AM - 3:00 PM' },
      thursday: { available: false, times: '' },
      friday: { available: true, times: '7:00 AM - 3:00 PM' },
      saturday: { available: false, times: '' },
      sunday: { available: false, times: '' }
    },
    adventureIds: []
  },
  {
    id: '10',
    name: 'Sophie Laurent',
    title: 'French Immersion Educator',
    bio: "Bonjour! I'm Sophie from Quebec, bringing French immersion childcare to Halifax. With 5 years of experience, I create a fun, French-speaking environment that helps children develop language skills naturally through songs, stories, and play.",
    avatar: 'SL',
    rating: 4.9,
    reviewCount: 22,
    totalBookings: 49,
    experience: 5,
    location: 'Halifax, NS',
    hourlyRate: 26,
    isVerified: true,
    responseRate: 96,
    responseTime: '< 30 minutes',
    certifications: [
      { name: 'French Teacher', icon: 'Award' },
      { name: 'First Aid/CPR', icon: 'ShieldCheck' },
      { name: 'Criminal Background Check', icon: 'ShieldCheck' }
    ],
    languages: ['French', 'English'],
    ageGroups: ['Toddlers (1-3y)', 'Preschool (3-5y)', 'School Age (6-12y)'],
    skills: [
      'French Immersion',
      'Language Development',
      'Arts & Crafts',
      'Music & Dance',
      'Meal Preparation'
    ],
    availability: {
      monday: { available: true, times: '9:00 AM - 5:00 PM' },
      tuesday: { available: true, times: '9:00 AM - 5:00 PM' },
      wednesday: { available: true, times: '9:00 AM - 5:00 PM' },
      thursday: { available: true, times: '9:00 AM - 5:00 PM' },
      friday: { available: true, times: '9:00 AM - 1:00 PM' },
      saturday: { available: false, times: '' },
      sunday: { available: false, times: '' }
    },
    adventureIds: ['3', '6']
  }
];
