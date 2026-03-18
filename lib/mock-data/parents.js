export const parents = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    email: 'sarah.johnson@email.com',
    phone: '(902) 555-0123',
    location: 'Halifax, NS',
    joinedDate: '2024-03-15',
    verifiedEmail: true,
    verifiedPhone: true,
    children: ['1', '2'],
    preferredLanguages: ['English'],
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '(902) 555-0124'
    },
    preferences: {
      ageGroups: ['Toddlers (1-3y)', 'Preschool (3-5y)'],
      languages: ['English'],
      certifications: ['First Aid/CPR', 'ECE Certified'],
      maxHourlyRate: 25,
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  {
    id: '2',
    name: 'Michael Brown',
    avatar: 'MB',
    email: 'michael.brown@email.com',
    phone: '(902) 555-0234',
    location: 'Dartmouth, NS',
    joinedDate: '2024-05-20',
    verifiedEmail: true,
    verifiedPhone: true,
    children: ['3'],
    preferredLanguages: ['English', 'French'],
    emergencyContact: {
      name: 'Lisa Brown',
      relationship: 'Spouse',
      phone: '(902) 555-0235'
    },
    preferences: {
      ageGroups: ['School Age (6-12y)'],
      languages: ['English', 'French'],
      certifications: ['First Aid/CPR'],
      maxHourlyRate: 22,
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
    }
  },
  {
    id: '3',
    name: 'Jennifer Lee',
    avatar: 'JL',
    email: 'jennifer.lee@email.com',
    phone: '(902) 555-0345',
    location: 'Halifax, NS',
    joinedDate: '2024-01-10',
    verifiedEmail: true,
    verifiedPhone: true,
    children: ['4', '5'],
    preferredLanguages: ['English', 'Mandarin'],
    emergencyContact: {
      name: 'David Lee',
      relationship: 'Spouse',
      phone: '(902) 555-0346'
    },
    preferences: {
      ageGroups: ['Infants (0-12m)', 'Preschool (3-5y)'],
      languages: ['English', 'Mandarin'],
      certifications: ['First Aid/CPR', 'Infant Care Certified'],
      maxHourlyRate: 30,
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  {
    id: '4',
    name: 'Robert Martinez',
    avatar: 'RM',
    email: 'robert.martinez@email.com',
    phone: '(902) 555-0456',
    location: 'Bedford, NS',
    joinedDate: '2024-06-05',
    verifiedEmail: true,
    verifiedPhone: false,
    children: ['6'],
    preferredLanguages: ['English', 'Spanish'],
    emergencyContact: {
      name: 'Maria Martinez',
      relationship: 'Spouse',
      phone: '(902) 555-0457'
    },
    preferences: {
      ageGroups: ['Toddlers (1-3y)'],
      languages: ['English', 'Spanish'],
      certifications: ['First Aid/CPR'],
      maxHourlyRate: 20,
      preferredDays: ['Saturday', 'Sunday']
    }
  },
  {
    id: '5',
    name: 'Emma Wilson',
    avatar: 'EW',
    email: 'emma.wilson@email.com',
    phone: '(902) 555-0567',
    location: 'Halifax, NS',
    joinedDate: '2024-04-12',
    verifiedEmail: true,
    verifiedPhone: true,
    children: ['7'],
    preferredLanguages: ['English'],
    emergencyContact: {
      name: 'James Wilson',
      relationship: 'Spouse',
      phone: '(902) 555-0568'
    },
    preferences: {
      ageGroups: ['School Age (6-12y)'],
      languages: ['English'],
      certifications: ['First Aid/CPR', 'Homework Help'],
      maxHourlyRate: 23,
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  }
];
