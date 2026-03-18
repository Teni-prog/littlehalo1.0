export const earnings = {
  sitter1: {
    sitterId: '1',
    totalEarnings: 2640,
    pendingPayouts: 176,
    availableBalance: 2464,
    weeklyEarnings: [
      { week: 'Week of Jan 27', amount: 264, bookings: 6 },
      { week: 'Week of Feb 3', amount: 308, bookings: 7 },
    ],
    monthlyEarnings: [
      { month: 'January 2026', amount: 1056, bookings: 24 },
      { month: 'December 2025', amount: 880, bookings: 20 },
      { month: 'November 2025', amount: 704, bookings: 16 }
    ],
    recentTransactions: [
      {
        id: 'txn-1',
        date: '2026-02-10',
        description: 'Booking with Sarah Johnson',
        amount: 88,
        status: 'pending',
        bookingId: '1'
      },
      {
        id: 'txn-2',
        date: '2026-02-08',
        description: 'Payout to bank account',
        amount: -440,
        status: 'completed',
        type: 'payout'
      },
      {
        id: 'txn-3',
        date: '2026-01-28',
        description: 'Booking with Robert Martinez',
        amount: 66,
        status: 'completed',
        bookingId: '11'
      },
      {
        id: 'txn-4',
        date: '2026-01-25',
        description: 'Booking with Sarah Johnson',
        amount: 75,
        status: 'completed',
        bookingId: '2'
      },
      {
        id: 'txn-5',
        date: '2026-01-20',
        description: 'Booking with Jennifer Lee',
        amount: 88,
        status: 'completed',
        bookingId: '4'
      }
    ],
    payoutSchedule: 'Weekly on Fridays',
    paymentMethod: {
      type: 'bank_account',
      last4: '4567',
      bankName: 'TD Bank'
    }
  },
  sitter2: {
    sitterId: '2',
    totalEarnings: 1880,
    pendingPayouts: 120,
    availableBalance: 1760,
    weeklyEarnings: [
      { week: 'Week of Jan 27', amount: 160, bookings: 4 },
      { week: 'Week of Feb 3', amount: 180, bookings: 5 }
    ],
    monthlyEarnings: [
      { month: 'January 2026', amount: 640, bookings: 16 },
      { month: 'December 2025', amount: 600, bookings: 15 },
      { month: 'November 2025', amount: 640, bookings: 16 }
    ],
    recentTransactions: [
      {
        id: 'txn-6',
        date: '2026-02-12',
        description: 'Booking with Michael Brown',
        amount: 60,
        status: 'pending',
        bookingId: '3'
      },
      {
        id: 'txn-7',
        date: '2026-02-01',
        description: 'Payout to bank account',
        amount: -320,
        status: 'completed',
        type: 'payout'
      },
      {
        id: 'txn-8',
        date: '2026-01-15',
        description: 'Booking with Sarah Johnson',
        amount: 80,
        status: 'completed',
        bookingId: '5'
      }
    ],
    payoutSchedule: 'Bi-weekly on Fridays',
    paymentMethod: {
      type: 'bank_account',
      last4: '8901',
      bankName: 'RBC'
    }
  },
  sitter3: {
    sitterId: '3',
    totalEarnings: 1875,
    pendingPayouts: 0,
    availableBalance: 1875,
    weeklyEarnings: [
      { week: 'Week of Jan 27', amount: 150, bookings: 3 },
      { week: 'Week of Feb 3', amount: 200, bookings: 4 }
    ],
    monthlyEarnings: [
      { month: 'January 2026', amount: 600, bookings: 12 },
      { month: 'December 2025', amount: 625, bookings: 13 },
      { month: 'November 2025', amount: 650, bookings: 13 }
    ],
    recentTransactions: [
      {
        id: 't9',
        date: '2026-01-25',
        description: 'Booking with Sarah Johnson',
        amount: 75,
        status: 'completed',
        bookingId: '2'
      },
      {
        id: 't10',
        date: '2026-01-15',
        description: 'Payout to bank account',
        amount: -500,
        status: 'completed',
        type: 'payout'
      },
      {
        id: 't11',
        date: '2026-01-10',
        description: 'Booking with Sarah Johnson',
        amount: 75,
        status: 'completed',
        bookingId: '10'
      }
    ],
    payoutSchedule: 'Weekly on Fridays',
    paymentMethod: {
      type: 'bank_account',
      last4: '2345',
      bankName: 'Scotiabank'
    }
  }
};
