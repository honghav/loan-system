import { ref, computed } from 'vue';
import { apiFetch } from '~/composables/apiFetchTwo';

export interface DashboardKpi {
  totalCustomers: number;
  totalActiveLoans: number;
  totalCompletedLoans: number;
  totalDisbursedAmount: number;
  thisWeekPaymentTotal: number;
  thisWeekPaymentCount: number;
  thisMonthPaymentTotal: number;
  thisMonthPaymentCount: number;
  totalOverdueAmount: number;
  totalOverdueCount: number;
  totalCollectedAmount: number;
}

export interface TopActiveCustomer {
  customerId: string;
  customerName: string;
  phoneNumber?: string;
  image?: string;
  telegramUsername?: string;
  loanId: string;
  loanNumber?: string;
  loanAmount: number;
  loanStatus: string;
  startDate: string;
  endDate?: string | null;
}

export interface StatusSummary {
  status: string;
  count: number;
  totalAmount: number;
}

export interface DashboardOverviewData {
  kpi: DashboardKpi;
  topActiveLoanCustomers: TopActiveCustomer[];
  loanStatusSummary: StatusSummary[];
  paymentStatusSummary: StatusSummary[];
}

export interface DashboardPaymentItem {
  id: string;
  paymentRequiredDate: string;
  totalPaymentNo: number;
  payDate?: string;
  totalPayment: number;
  beginningBalance: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: string;
  loanInformation?: {
    id?: string;
    loanNumber?: string;
    customer?: {
      id?: string;
      customerName?: string;
      phoneNumber?: string;
      image?: string;
      telegramUsername?: string;
    };
  };
}

export interface DashboardPaymentsData {
  period: 'week' | 'month';
  startDate: string;
  endDate: string;
  count: number;
  totalAmount: number;
  payments: DashboardPaymentItem[];
}

// Reactive state
export const dashboardOverview = ref<DashboardOverviewData | null>(null);
export const dashboardPayments = ref<DashboardPaymentsData | null>(null);
export const isDashboardLoading = ref<boolean>(false);

export async function fetchDashboardOverview(): Promise<void> {
  isDashboardLoading.value = true;
  try {
    const res: any = await apiFetch('GET', 'dashboard/overview');
    if (res?.data) {
      dashboardOverview.value = res.data;
    }
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
  } finally {
    isDashboardLoading.value = false;
  }
}

export async function fetchDashboardPayments(
  period: 'week' | 'month' = 'week',
  monthStr?: string,
): Promise<void> {
  try {
    let endpoint = `dashboard/payments?period=${period}`;
    if (monthStr) {
      endpoint += `&month=${monthStr}`;
    }
    const res: any = await apiFetch('GET', endpoint);
    if (res?.data) {
      dashboardPayments.value = res.data;
    }
  } catch (error) {
    console.error('Error fetching dashboard payments:', error);
  }
}
