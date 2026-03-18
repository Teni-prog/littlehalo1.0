// Mock data for job applications from sitters
export const jobApplications = [
  // Applications for job1 (8 applications - popular job)
  {
    id: 'app-1',
    jobId: 'job1',
    sitterId: '1',
    sitterName: 'Emily Chen',
    sitterAvatar: 'EC',
    sitterRating: 4.9,
    sitterReviews: 42,
    sitterExperience: 5,
    parentId: '1',
    appliedDate: '2026-02-04T10:30:00',
    status: 'pending',
    message: "Hi Sarah! I would love to help with your children on Saturday evening. I have 5 years of experience working with toddlers and preschoolers, and I'm CPR certified. I love incorporating games and activities to keep kids engaged. Looking forward to hearing from you!",
    availability: 'confirmed',
    viewed: false,
    matchScore: 95,
    certifications: ['CPR Certified', 'First Aid', 'ECE Certified', 'Background Check'],
    specialties: ['Toddler Care', 'Meal Prep', 'Arts & Crafts']
  },
  {
    id: 'app-2',
    jobId: 'job1',
    sitterId: '2',
    sitterName: 'Marcus Thompson',
    sitterAvatar: 'MT',
    sitterRating: 4.8,
    sitterReviews: 38,
    sitterExperience: 8,
    parentId: '1',
    appliedDate: '2026-02-04T14:20:00',
    status: 'shortlisted',
    message: "Hello! I'm Marcus, a father of two with 8 years of childcare experience. I'm available for your Saturday evening date night. I'm great with active kids and can keep them entertained with games and outdoor activities if weather permits. CPR and First Aid certified.",
    availability: 'confirmed',
    viewed: true,
    matchScore: 88,
    certifications: ['CPR Certified', 'First Aid', 'Water Safety', 'Background Check'],
    specialties: ['Active Play', 'Sports & Games', 'Swimming']
  },
  {
    id: 'app-3',
    jobId: 'job1',
    sitterId: '3',
    sitterName: 'Sarah Mitchell',
    sitterAvatar: 'SM',
    sitterRating: 5.0,
    sitterReviews: 29,
    sitterExperience: 6,
    parentId: '1',
    appliedDate: '2026-02-03T16:45:00',
    status: 'shortlisted',
    message: "Hi there! I'm a certified Montessori teacher with 6 years of experience. I'd be delighted to care for your children. I can bring some age-appropriate educational activities and games to keep them engaged throughout the evening. I have excellent references and am fully certified.",
    availability: 'confirmed',
    viewed: true,
    matchScore: 92,
    certifications: ['Montessori Certified', 'CPR Certified', 'First Aid', 'ECE Certified', 'Background Check'],
    specialties: ['Montessori Activities', 'Educational Play', 'Arts & Crafts']
  },
  {
    id: 'app-4',
    jobId: 'job1',
    sitterId: '4',
    sitterName: 'Jessica Rodriguez',
    sitterAvatar: 'JR',
    sitterRating: 4.7,
    sitterReviews: 31,
    sitterExperience: 4,
    parentId: '1',
    appliedDate: '2026-02-05T09:15:00',
    status: 'pending',
    message: "¡Hola! I'm Jessica, a bilingual sitter with 4 years of experience. I'm available for your date night and would love to meet your family. I'm great with toddlers and can incorporate fun Spanish language activities if you'd like!",
    availability: 'confirmed',
    viewed: false,
    matchScore: 85,
    certifications: ['CPR Certified', 'First Aid', 'Background Check'],
    specialties: ['Bilingual Care', 'Toddler Care', 'Music & Dance']
  },
  {
    id: 'app-5',
    jobId: 'job1',
    sitterId: '5',
    sitterName: 'David Kim',
    sitterAvatar: 'DK',
    sitterRating: 4.9,
    sitterReviews: 24,
    sitterExperience: 3,
    parentId: '1',
    appliedDate: '2026-02-05T11:30:00',
    status: 'pending',
    message: "Hi! I'm David and I'd be happy to help with your Saturday evening. I have experience with preschool-aged children and love bringing STEM activities and building projects to keep kids engaged. CPR certified and have great references.",
    availability: 'confirmed',
    viewed: true,
    matchScore: 82,
    certifications: ['CPR Certified', 'First Aid', 'Background Check'],
    specialties: ['STEM Activities', 'Problem Solving', 'Homework Help']
  },
  {
    id: 'app-6',
    jobId: 'job1',
    sitterId: '6',
    sitterName: 'Amanda Bennett',
    sitterAvatar: 'AB',
    sitterRating: 5.0,
    sitterReviews: 19,
    sitterExperience: 7,
    parentId: '1',
    appliedDate: '2026-02-04T08:00:00',
    status: 'accepted',
    message: "Hello Sarah! I have 7 years of experience working with children of all abilities. I specialize in creating calm, structured environments where children can thrive. I'm available for your Saturday date night and would love to care for your little ones. Fully certified in CPR, First Aid, and specialized training.",
    availability: 'confirmed',
    viewed: true,
    matchScore: 98,
    certifications: ['Special Needs Training', 'CPR Certified', 'First Aid', 'Behavioral Management', 'Background Check'],
    specialties: ['Special Needs Care', 'Behavioral Support', 'Sensory Activities']
  },
  {
    id: 'app-7',
    jobId: 'job1',
    sitterId: '7',
    sitterName: 'Lisa Anderson',
    sitterAvatar: 'LA',
    sitterRating: 4.8,
    sitterReviews: 26,
    sitterExperience: 5,
    parentId: '1',
    appliedDate: '2026-02-05T13:45:00',
    status: 'rejected',
    message: "Hi! I'm an infant care specialist but also have experience with toddlers and preschoolers. I'd love to help with your evening. I'm gentle, patient, and fully certified in safe care practices.",
    availability: 'confirmed',
    viewed: true,
    matchScore: 78,
    certifications: ['CPR Certified', 'First Aid', 'Infant Care Certified', 'Background Check'],
    specialties: ['Infant Care', 'Safe Sleep Practices', 'Gentle Care']
  },
  {
    id: 'app-8',
    jobId: 'job1',
    sitterId: '8',
    sitterName: 'Ryan O\'Connor',
    sitterAvatar: 'RO',
    sitterRating: 4.6,
    sitterReviews: 15,
    sitterExperience: 2,
    parentId: '1',
    appliedDate: '2026-02-06T10:00:00',
    status: 'pending',
    message: "Hey! I'm Ryan, a college student studying Early Childhood Education. I have 2 years of hands-on experience through internships and babysitting. I'm energetic, responsible, and kids love me! CPR certified.",
    availability: 'confirmed',
    viewed: false,
    matchScore: 75,
    certifications: ['CPR Certified', 'Background Check'],
    specialties: ['Active Play', 'Games', 'Outdoor Activities']
  },

  // Applications for job2 (2 applications)
  {
    id: 'app-9',
    jobId: 'job2',
    sitterId: '1',
    sitterName: 'Emily Chen',
    sitterAvatar: 'EC',
    sitterRating: 4.9,
    sitterReviews: 42,
    sitterExperience: 5,
    parentId: '2',
    appliedDate: '2026-02-03T15:20:00',
    status: 'pending',
    message: "Hi Michael! I'm available tomorrow evening and would be happy to help. I have extensive experience with children ages 3-5 and can handle dinner time with ease. Looking forward to meeting your family!",
    availability: 'confirmed',
    viewed: false,
    matchScore: 90,
    certifications: ['CPR Certified', 'First Aid', 'ECE Certified', 'Background Check'],
    specialties: ['Toddler Care', 'Meal Prep', 'Arts & Crafts']
  },
  {
    id: 'app-10',
    jobId: 'job2',
    sitterId: '3',
    sitterName: 'Sarah Mitchell',
    sitterAvatar: 'SM',
    sitterRating: 5.0,
    sitterReviews: 29,
    sitterExperience: 6,
    parentId: '2',
    appliedDate: '2026-02-03T17:30:00',
    status: 'shortlisted',
    message: "Hello! I'm a Montessori-certified teacher and can provide excellent care for your children tomorrow evening. I respond quickly and have perfect reviews. Happy to provide references!",
    availability: 'confirmed',
    viewed: true,
    matchScore: 94,
    certifications: ['Montessori Certified', 'CPR Certified', 'First Aid', 'ECE Certified', 'Background Check'],
    specialties: ['Montessori Activities', 'Educational Play', 'Meal Prep']
  },

  // Applications for job3 (3 applications)
  {
    id: 'app-11',
    jobId: 'job3',
    sitterId: '3',
    sitterName: 'Sarah Mitchell',
    sitterAvatar: 'SM',
    sitterRating: 5.0,
    sitterReviews: 29,
    sitterExperience: 6,
    parentId: '3',
    appliedDate: '2026-02-02T14:00:00',
    status: 'accepted',
    message: "Hi Jennifer! A full day of care is perfect for me - I specialize in creating enriching, educational experiences for preschoolers. I can plan age-appropriate activities throughout the day and am First Aid certified. I'd love to help while you're at your conference!",
    availability: 'confirmed',
    viewed: true,
    matchScore: 97,
    certifications: ['Montessori Certified', 'CPR Certified', 'First Aid', 'ECE Certified', 'Background Check'],
    specialties: ['Preschool Care', 'Educational Activities', 'Full Day Care']
  },
  {
    id: 'app-12',
    jobId: 'job3',
    sitterId: '5',
    sitterName: 'David Kim',
    sitterAvatar: 'DK',
    sitterRating: 4.9,
    sitterReviews: 24,
    sitterExperience: 3,
    parentId: '3',
    appliedDate: '2026-02-03T09:45:00',
    status: 'pending',
    message: "Hello! I have experience with full-day care and love working with preschoolers. I can incorporate fun STEM activities and keep your 4-year-old engaged throughout the day. First Aid and CPR certified.",
    availability: 'confirmed',
    viewed: false,
    matchScore: 86,
    certifications: ['CPR Certified', 'First Aid', 'Background Check'],
    specialties: ['STEM Activities', 'Preschool Care', 'Educational Play']
  },
  {
    id: 'app-13',
    jobId: 'job3',
    sitterId: '4',
    sitterName: 'Jessica Rodriguez',
    sitterAvatar: 'JR',
    sitterRating: 4.7,
    sitterReviews: 31,
    sitterExperience: 4,
    parentId: '3',
    appliedDate: '2026-02-02T16:30:00',
    status: 'shortlisted',
    message: "Hi! I'm available for full-day care on Feb 8th. I have 4 years of experience with preschoolers and can provide bilingual care if interested. I'm patient, creative, and First Aid certified. Your child will have a fun and safe day!",
    availability: 'confirmed',
    viewed: true,
    matchScore: 88,
    certifications: ['CPR Certified', 'First Aid', 'Background Check'],
    specialties: ['Bilingual Care', 'Preschool Care', 'Arts & Crafts']
  },

  // Applications for job4 (2 applications)
  {
    id: 'app-14',
    jobId: 'job4',
    sitterId: '5',
    sitterName: 'David Kim',
    sitterAvatar: 'DK',
    sitterRating: 4.9,
    sitterReviews: 24,
    sitterExperience: 3,
    parentId: '4',
    appliedDate: '2026-02-01T11:00:00',
    status: 'shortlisted',
    message: "Hi Robert! After-school care with homework help is my specialty! I'm an engineer-turned-educator and excel at helping school-age children with their studies. I can provide this recurring care on Mon, Wed, Fri as needed. Looking forward to helping your 7-year-old succeed!",
    availability: 'confirmed',
    viewed: true,
    matchScore: 96,
    certifications: ['CPR Certified', 'First Aid', 'Background Check'],
    specialties: ['Homework Help', 'STEM Activities', 'School-Age Care']
  },
  {
    id: 'app-15',
    jobId: 'job4',
    sitterId: '2',
    sitterName: 'Marcus Thompson',
    sitterAvatar: 'MT',
    sitterRating: 4.8,
    sitterReviews: 38,
    sitterExperience: 8,
    parentId: '4',
    appliedDate: '2026-01-31T15:30:00',
    status: 'pending',
    message: "Hello! I'm a father of two and have years of experience with after-school care. I can help with homework, prepare healthy snacks, and keep your son engaged with activities. Available for recurring care as needed.",
    availability: 'confirmed',
    viewed: true,
    matchScore: 84,
    certifications: ['CPR Certified', 'First Aid', 'Water Safety', 'Background Check'],
    specialties: ['After-School Care', 'Homework Help', 'Meal Prep']
  }
];

// Helper function to get applications by job ID
export function getApplicationsByJobId(jobId) {
  return jobApplications.filter(app => app.jobId === jobId);
}

// Helper function to get application statistics for a job
export function getApplicationStats(jobId) {
  const apps = getApplicationsByJobId(jobId);
  return {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
    new: apps.filter(a => !a.viewed).length
  };
}

// Helper function to get an application by ID
export function getApplicationById(applicationId) {
  return jobApplications.find(app => app.id === applicationId);
}

// Helper function to filter applications by status
export function filterApplicationsByStatus(jobId, status) {
  const apps = getApplicationsByJobId(jobId);
  if (status === 'all') return apps;
  if (status === 'new') return apps.filter(a => !a.viewed);
  return apps.filter(a => a.status === status);
}
