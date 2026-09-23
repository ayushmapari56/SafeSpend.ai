export const BASELINE_STATE = {
  liquidBalance: 14250,
  safeToSpendDaily: 850,
  safetyBuffer: 2000,
  incomeDelayDays: 0,
  expenseShockAmount: 0,
  isOttPaused: false,
  splitPaymentActive: false,
  actionRejected: false,
  status: 'SAFE', // 'SAFE', 'WARNING', 'RESTORED'
  statusMessage: 'STATUS: LIQUIDITY SAFE',
  stipendArrivalDay: 4, // Day 4 (Oct 3)
  stipendConfidence: 85,
  timeframe: '14d', // '7d' or '14d'
  lastAction: null,
};

export const INITIAL_COMMITMENTS = [
  { id: 'c1', name: 'Apartment Rent', amount: 8000, dueDate: 'Oct 1', dayIndex: 2, category: 'Housing', priority: 'High', autoDebit: true },
  { id: 'c2', name: 'High-Speed Wi-Fi', amount: 799, dueDate: 'Oct 3', dayIndex: 4, category: 'Utilities', priority: 'Medium', autoDebit: true },
  { id: 'c3', name: 'Gold\'s Gym Membership', amount: 1200, dueDate: 'Oct 7', dayIndex: 8, category: 'Wellness', priority: 'Low', autoDebit: false },
  { id: 'c4', name: 'OTT & Media Subscriptions', amount: 1499, dueDate: 'Oct 5', dayIndex: 6, category: 'Entertainment', priority: 'Deferrable', autoDebit: true },
];

export const INITIAL_INCOMES = [
  { id: 'i1', name: 'College Academic Stipend', amount: 12000, expectedDate: 'Oct 3', baseConfidence: 85, delayConfidence: 60, isPrimary: true },
  { id: 'i2', name: 'Freelance UI Design Payout', amount: 6500, expectedDate: 'Oct 9', baseConfidence: 90, delayConfidence: 90, isPrimary: false },
  { id: 'i3', name: 'Peer Mentoring Reward', amount: 2000, expectedDate: 'Oct 12', baseConfidence: 95, delayConfidence: 95, isPrimary: false },
];

// Helper to generate 14-day projection data points
export function calculate14DayProjection(state) {
  const days = [];
  const baseBalance = state.liquidBalance;
  const safetyBuffer = state.safetyBuffer;
  const stipendArrival = state.incomeDelayDays > 0 ? (4 + state.incomeDelayDays) : 4;
  const isOttPaused = state.isOttPaused;

  const dates = [
    'Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5',
    'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12'
  ];

  let currentBal = baseBalance;

  for (let i = 0; i < 14; i++) {
    const date = dates[i];
    const dayNum = i + 1;

    // Baseline daily essential burn (food, transport ~₹350/day)
    currentBal -= 350;

    // Day 2 (Oct 1): Rent ₹8,000 (or ₹4,000 if split)
    if (dayNum === 2) {
      currentBal -= state.splitPaymentActive ? 4000 : 8000;
    }

    // Day 4 (Oct 3): Wi-Fi ₹799
    if (dayNum === 4) {
      currentBal -= 799;
    }

    // Day 6 (Oct 5): OTT ₹1499 if not paused
    if (dayNum === 6 && !isOttPaused) {
      currentBal -= 1499;
    }

    // Day 8 (Oct 7): Gym ₹1200
    if (dayNum === 8) {
      currentBal -= 1200;
    }

    // Split rent 2nd half on Day 10 if active
    if (dayNum === 10 && state.splitPaymentActive) {
      currentBal -= 4000;
    }

    // Stipend Arrival (₹12,000) on computed arrival day
    if (dayNum === stipendArrival) {
      currentBal += 12000;
    }

    // Day 10 (Oct 9): Freelance payout ₹6,500
    if (dayNum === 10) {
      currentBal += 6500;
    }

    // Day 13 (Oct 12): Mentoring ₹2,000
    if (dayNum === 13) {
      currentBal += 2000;
    }

    const isBelowBuffer = currentBal < safetyBuffer;

    days.push({
      day: `Day ${dayNum}`,
      date: date,
      dayNum: dayNum,
      balance: Math.round(currentBal),
      buffer: safetyBuffer,
      isBelowBuffer: isBelowBuffer,
      status: isBelowBuffer ? 'BREACH' : 'SAFE',
    });
  }

  return days;
}
