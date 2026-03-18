// Current logged-in sitter data
export const currentSitter = {
  id: '1',
  firstName: 'Emily',
  lastName: 'Chen',
  name: 'Emily Chen',
  email: 'emily.chen@example.com',
  phone: '(902) 555-0123',
  age: 28,
  city: 'Halifax, NS',
  avatar: 'EC',
  bio: "Hello! I'm Emily, a passionate and experienced childcare provider with over 5 years of professional experience working with children of all ages. I hold an Early Childhood Education (ECE) certification and am certified in First Aid and CPR.\n\nI believe in creating a nurturing, safe, and engaging environment where children can learn and grow. I love incorporating educational activities, arts and crafts, outdoor play, and creative storytelling into my care.",
  rating: 4.9,
  reviewCount: 42,
  totalBookings: 127,
  experience: 5,
  hourlyRate: 22,
  isVerified: true,
  responseRate: 95,
  responseTime: '< 1 hour',
  
  // Certifications
  certifications: [
    'First Aid/CPR',
    'ECE Certified',
    'Special Needs Training'
  ],
  
  // Languages
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Mandarin', level: 'Fluent' }
  ],
  
  // Age groups comfortable with
  ageGroups: [
    'Infants (0-12 months)',
    'Toddlers (1-3 years)',
    'Preschoolers (3-5 years)',
    'School Age (6-12 years)'
  ],
  
  // Special skills
  skills: [
    'Meal Preparation',
    'Homework Help',
    'Light Housekeeping',
    'Transportation',
    'Arts & Crafts'
  ],
  
  // Availability
  availability: {
    monday: { available: true, times: '9 AM - 6 PM' },
    tuesday: { available: true, times: '9 AM - 6 PM' },
    wednesday: { available: true, times: '2 PM - 8 PM' },
    thursday: { available: true, times: '9 AM - 6 PM' },
    friday: { available: true, times: '9 AM - 6 PM' },
    saturday: { available: false, times: 'By Request' },
    sunday: { available: false, times: 'By Request' }
  },
  
  // Profile photos (mock)
  photos: [
    { id: '1', url: '/placeholder-photo-1.jpg', isPrimary: true },
    { id: '2', url: '/placeholder-photo-2.jpg', isPrimary: false },
    { id: '3', url: '/placeholder-photo-3.jpg', isPrimary: false }
  ],
  
  // Reviews from parents (from reviews.js)
  reviews: [
    {
      id: '1',
      parentName: 'Sarah Johnson',
      parentAvatar: 'SJ',
      rating: 5,
      date: '2 weeks ago',
      comment: "Emily is absolutely wonderful with our 3-year-old daughter! She's patient, creative, and always comes prepared with fun activities. Highly recommend!"
    },
    {
      id: '2',
      parentName: 'Michael Chen',
      parentAvatar: 'MC',
      rating: 5,
      date: '1 month ago',
      comment: "Very professional and reliable. Emily has been watching our twin boys for the past year and we couldn't be happier."
    },
    {
      id: '3',
      parentName: 'Amanda Rodriguez',
      parentAvatar: 'AR',
      rating: 5,
      date: '2 months ago',
      comment: "Emily is fantastic! She's punctual, communicative, and genuinely cares about the wellbeing of our children."
    }
  ]
};
