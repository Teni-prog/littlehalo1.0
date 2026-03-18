// Job opportunities for sitters
export const jobOpportunities = [
  {
    id: 'job1',
    parentId: '1',
    parentName: 'Sarah Johnson',
    parentInitials: 'SJ',
    location: 'Manhattan, NY',
    distance: 2.3,
    date: '2026-02-08',
    dateDisplay: 'Saturday, Feb 8, 2026',
    startTime: '18:00',
    endTime: '23:00',
    timeDisplay: '6:00 PM - 11:00 PM',
    duration: 5,
    childrenCount: 2,
    childrenAges: [3, 5],
    childrenDisplay: '2 kids (Ages 3, 5)',
    hourlyRate: 30,
    totalPay: 150,
    description: 'Need a reliable sitter for date night. Kids are well-behaved and love games.',
    requirements: ['CPR Certified', 'Experience with toddlers'],
    status: 'new',
    postedDate: '2026-02-03'
  },
  {
    id: 'job2',
    parentId: '2',
    parentName: 'Michael Chen',
    parentInitials: 'MC',
    location: 'Brooklyn, NY',
    distance: 4.1,
    date: '2026-02-04',
    dateDisplay: 'Tomorrow, Feb 4',
    startTime: '18:00',
    endTime: '22:00',
    timeDisplay: '6:00 PM - 10:00 PM',
    duration: 4,
    childrenCount: 2,
    childrenAges: [3, 5],
    childrenDisplay: '2 kids (Ages 3, 5)',
    hourlyRate: 24,
    totalPay: 96,
    description: 'Evening babysitting needed. Dinner will be provided.',
    requirements: ['References required'],
    status: 'urgent',
    postedDate: '2026-02-03'
  },
  {
    id: 'job3',
    parentId: '3',
    parentName: 'Jennifer Lee',
    parentInitials: 'JL',
    location: 'Queens, NY',
    distance: 3.5,
    date: '2026-02-08',
    dateDisplay: 'Feb 8',
    startTime: '09:00',
    endTime: '17:00',
    timeDisplay: '9:00 AM - 5:00 PM',
    duration: 8,
    childrenCount: 1,
    childrenAges: [4],
    childrenDisplay: '1 child (Age 4)',
    hourlyRate: 22,
    totalPay: 176,
    description: 'Full day care needed while I attend a conference.',
    requirements: ['Experience with preschoolers', 'First aid'],
    status: 'new',
    postedDate: '2026-02-02'
  },
  {
    id: 'job4',
    parentId: '4',
    parentName: 'Robert Martinez',
    parentInitials: 'RM',
    location: 'Manhattan, NY',
    distance: 1.8,
    date: '2026-02-10',
    dateDisplay: 'Monday, Feb 10',
    startTime: '15:00',
    endTime: '18:00',
    timeDisplay: '3:00 PM - 6:00 PM',
    duration: 3,
    childrenCount: 1,
    childrenAges: [7],
    childrenDisplay: '1 child (Age 7)',
    hourlyRate: 20,
    totalPay: 60,
    description: 'After school care. Help with homework and light snack.',
    requirements: ['Homework help'],
    status: 'recurring',
    postedDate: '2026-01-30',
    recurring: 'Weekly on Mon, Wed, Fri'
  },
  {
    id: 'job5',
    parentId: '5',
    parentName: 'Amanda Rodriguez',
    parentInitials: 'AR',
    location: 'Bronx, NY',
    distance: 5.2,
    date: '2026-02-11',
    dateDisplay: 'Tuesday, Feb 11',
    startTime: '19:00',
    endTime: '23:00',
    timeDisplay: '7:00 PM - 11:00 PM',
    duration: 4,
    childrenCount: 3,
    childrenAges: [2, 5, 8],
    childrenDisplay: '3 kids (Ages 2, 5, 8)',
    hourlyRate: 28,
    totalPay: 112,
    description: 'Need experienced sitter for three active kids. Bedtime routine help needed.',
    requirements: ['Experience with multiple children', 'CPR Certified'],
    status: 'new',
    postedDate: '2026-02-03'
  },
  {
    id: 'job6',
    parentId: '6',
    parentName: 'David Kim',
    parentInitials: 'DK',
    location: 'Manhattan, NY',
    distance: 2.0,
    date: '2026-02-09',
    dateDisplay: 'Sunday, Feb 9',
    startTime: '10:00',
    endTime: '14:00',
    timeDisplay: '10:00 AM - 2:00 PM',
    duration: 4,
    childrenCount: 2,
    childrenAges: [4, 6],
    childrenDisplay: '2 kids (Ages 4, 6)',
    hourlyRate: 25,
    totalPay: 100,
    description: 'Sunday morning care. Kids enjoy outdoor activities.',
    requirements: ['Active and engaging'],
    status: 'new',
    postedDate: '2026-02-01'
  },
  {
    id: 'job7',
    parentId: '7',
    parentName: 'Lisa Thompson',
    parentInitials: 'LT',
    location: 'Brooklyn, NY',
    distance: 3.8,
    date: '2026-02-12',
    dateDisplay: 'Wednesday, Feb 12',
    startTime: '16:00',
    endTime: '20:00',
    timeDisplay: '4:00 PM - 8:00 PM',
    duration: 4,
    childrenCount: 1,
    childrenAges: [5],
    childrenDisplay: '1 child (Age 5)',
    hourlyRate: 23,
    totalPay: 92,
    description: 'After school care with dinner prep.',
    requirements: ['Cooking skills helpful'],
    status: 'new',
    postedDate: '2026-02-03'
  },
  {
    id: 'job8',
    parentId: '8',
    parentName: 'Carlos Hernandez',
    parentInitials: 'CH',
    location: 'Queens, NY',
    distance: 4.5,
    date: '2026-02-14',
    dateDisplay: 'Friday, Feb 14',
    startTime: '18:30',
    endTime: '23:30',
    timeDisplay: '6:30 PM - 11:30 PM',
    duration: 5,
    childrenCount: 2,
    childrenAges: [6, 9],
    childrenDisplay: '2 kids (Ages 6, 9)',
    hourlyRate: 26,
    totalPay: 130,
    description: "Valentine's Day date night. Kids love board games.",
    requirements: ['Creative activities'],
    status: 'new',
    postedDate: '2026-02-02'
  }
];

export const getJobsByStatus = (status) => {
  if (!status) return jobOpportunities;
  return jobOpportunities.filter(job => job.status === status);
};

export const getJobsByDate = (dateFilter) => {
  const today = new Date('2026-02-03');
  const tomorrow = new Date('2026-02-04');
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  return jobOpportunities.filter(job => {
    const jobDate = new Date(job.date);
    
    switch(dateFilter) {
      case 'tonight':
        return jobDate.toDateString() === today.toDateString();
      case 'this_week':
        return jobDate >= today && jobDate <= weekEnd;
      case 'recurring':
        return job.status === 'recurring';
      default:
        return true;
    }
  });
};
