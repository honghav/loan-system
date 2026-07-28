export interface CalculateScheduleParams {
  amount: number; // e.g., 1000
  durationMonths: number; // e.g., 12
  monthlyRate: number; // e.g., 1.2 (for 1.2%)
  startDate?: string | Date | null; // e.g., "2026-01-01" or null
  frequencyDay?: number | null;
}

export interface PaymentScheduleItem {
  paymentRequiredDate: string; // 'YYYY-MM-DD' or 'Month 1'
  beginningBalance: number;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export function generatePaymentSchedule({
  amount,
  durationMonths,
  monthlyRate,
  startDate = null,
  frequencyDay = null,
}: CalculateScheduleParams): PaymentScheduleItem[] {
  const schedule: PaymentScheduleItem[] = [];
  const rateFraction = monthlyRate / 100;

  // Calculate fixed monthly payment using PMT formula
  // PMT = P * [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]
  const fixedMonthlyPayment =
    (amount * (rateFraction * Math.pow(1 + rateFraction, durationMonths))) /
    (Math.pow(1 + rateFraction, durationMonths) - 1);

  let currentBalance = amount;
  let baseDate: Date | null = startDate ? new Date(startDate) : null;

  for (let month = 1; month <= durationMonths; month++) {
    const beginningBalance = Number(currentBalance.toFixed(2));

    // Calculate interest for current balance
    const interest = Number((beginningBalance * rateFraction).toFixed(2));

    let principal: number;
    let totalPayment: number;

    // Final month adjustment to clean up rounding pennies
    if (month === durationMonths) {
      principal = beginningBalance;
      totalPayment = Number((principal + interest).toFixed(2));
      currentBalance = 0;
    } else {
      totalPayment = Number(fixedMonthlyPayment.toFixed(2));
      principal = Number((totalPayment - interest).toFixed(2));
      currentBalance = Number((beginningBalance - principal).toFixed(2));
    }

    // Determine paymentRequiredDate format
    let paymentRequiredDate: string;
    if (baseDate) {
      const payDate = new Date(baseDate);
      if (frequencyDay && frequencyDay > 0) {
        payDate.setDate(payDate.getDate() + (month - 1) * frequencyDay);
      } else {
        payDate.setMonth(payDate.getMonth() + (month - 1));
      }
      paymentRequiredDate = payDate.toISOString().split('T')[0];
    } else {
      paymentRequiredDate = `Period ${month}`;
    }

    schedule.push({
      paymentRequiredDate,
      beginningBalance,
      totalPayment,
      principal,
      interest,
      remainingBalance: currentBalance,
    });
  }

  return schedule;
}

