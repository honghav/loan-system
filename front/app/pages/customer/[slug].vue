<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">


    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-40 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div class="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </div>

    <!-- Main Content Layout -->
    <template v-else-if="loanInfomationByIdData">
      <!-- Hero Banner Card: Borrower & Loan Profile -->
      <div class="relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/0 to-transparent pointer-events-none" />

        <div class="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          <!-- Borrower Info -->
          <div class="flex items-start sm:items-center gap-4">
            <div class="relative">
              <NuxtImg
                :src="getImagePath(loanInfomationByIdData.loanInfoLoanerImage)"
                class="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-500/10 dark:ring-primary-500/20 bg-neutral-100 dark:bg-neutral-800"
                alt="Borrower Avatar"
              />
              <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" title="Active Account" />
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-xl font-bold text-neutral-900 dark:text-white">
                  {{ loanInfomationByIdData.loanInfoLoaner || 'Unknown Borrower' }}
                </h2>
                <span class="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {{ loanInfomationByIdData.loanInfoNumber }}
                </span>
              </div>

              <p class="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <span>Purpose: <strong class="text-neutral-700 dark:text-neutral-300 font-medium">{{ loanInfomationByIdData.loanInfoPurposeOfLoan || 'N/A' }}</strong></span>
              </p>

              <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border border-primary-200/50 dark:border-primary-800/50">
                  {{ loanInfomationByIdData.loanInfoTypeDay ? `${loanInfomationByIdData.loanInfoTypeDay} Days` : '' }} {{ loanInfomationByIdData.loanInfoTypeName || 'Regular' }}
                </span>

                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {{ formatPaymentType(loanInfomationByIdData.loanInfoPaymentType) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Total Periods Badge & Fast Meta -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
            <div class="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800 text-center min-w-[120px]">
              <span class="block text-2xl font-bold text-neutral-900 dark:text-white">
                {{ loanInfomationByIdData.loanInfoTotalMonth || 0 }}
              </span>
              <span class="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                Total Periods
              </span>
            </div>

            <div class="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800 text-center min-w-[120px]">
              <span class="block text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ loanInfomationByIdData.loanInfoLoanFee }}%
              </span>
              <span class="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                Interest Fee
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Payment Table & Schedule Section -->
      <div class="space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div>
            <h3 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Payment Schedule Table</span>
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                {{ filteredPayments.length }} records
              </span>
            </h3>
          </div>


            <!-- View Switcher -->
            <div class="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-1.5 rounded-lg transition-all',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400'
                ]"
                title="Grid View"
              >
                <span class="i-lucide-layout-grid w-4 h-4" >Grid View</span>
              </button>
              <button
                @click="viewMode = 'table'"
                :class="[
                  'p-1.5 rounded-lg transition-all',
                  viewMode === 'table'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400'
                ]"
                title="Table View"
              >
                <span class="i-lucide-layout-grid w-4 h-4" >Table View</span>
              </button>
            </div>
        </div>

        <!-- Grid View Mode -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="table in filteredPayments"
            :key="table.payId"
            class="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 hover:shadow-md transition-all relative overflow-hidden group"
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center justify-center border border-primary-200/40 dark:border-primary-800/40">
                  #{{ table.payNumber }}
                </span>
                <span class="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {{ loanInfomationByIdData.loanInfoNumber }}
                </span>
              </div>

              <!-- Status Badge -->
              <span
              >
                <span :class="[getStatusBadge(table.payStatus).icon, 'w-3.5 h-3.5']" />
                {{ getStatusBadge(table.payStatus).label }}
              </span>
            </div>

            <!-- Card Financial Breakdown -->
            <div class="space-y-2">
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-neutral-500 dark:text-neutral-400">Total Repayment</span>
                <span class="text-xl font-extrabold text-neutral-900 dark:text-white">
                  {{ formatCurrency(table.payTotalPayment) }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-xs">
                <div>
                  <span class="block text-[10px] text-neutral-400 font-medium">Principal</span>
                  <span class="font-semibold text-neutral-700 dark:text-neutral-300">
                    {{ formatCurrency(table.payPrincipal) }}
                  </span>
                </div>
                <div>
                  <span class="block text-[10px] text-neutral-400 font-medium">Interest</span>
                  <span class="font-semibold text-neutral-700 dark:text-neutral-300">
                    {{ formatCurrency(table.payInterest) }}
                  </span>
                </div>
                <div>
                  <span class="block text-[10px] text-neutral-400 font-medium">Beg. Balance</span>
                  <span class="font-semibold text-neutral-700 dark:text-neutral-300">
                    {{ formatCurrency(table.payBeginningBalance) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Dates Information -->
            <div class="flex items-center justify-between text-xs pt-1 text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
              <div class="flex items-center gap-1">
                <span class="i-lucide-calendar w-3.5 h-3.5 text-neutral-400" />
                <span>Due: <strong class="text-neutral-700 dark:text-neutral-300">{{ formatDate(table.payPaymentRequiredDate) }}</strong></span>
              </div>
              <div v-if="table.payPayDate" class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span class="i-lucide-check-circle-2 w-3.5 h-3.5" />
                <span>Paid: {{ formatDate(table.payPayDate) }}</span>
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-2">
              <button
                v-if="table.payStatus !== 'PAID'"
                @click="openPayModal(table)"
                class="w-full py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-black font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                Process Payment
              </button>

              <div
                v-else
                class="w-full py-2 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium text-xs text-center flex items-center justify-center gap-1.5"
              >
                Payment Completed
              </div>
            </div>
          </div>
        </div>

        <!-- Table View Mode -->
        <div v-else class="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-max text-xs">
              <thead>
                <tr class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-neutral-500 font-semibold uppercase tracking-wider">
                  <th class="px-4 py-3.5 text-center w-12">#</th>
                  <th class="px-4 py-3.5">{{ $t('loan.loan_number') }}</th>
                  <th class="px-4 py-3.5 text-center">{{ $t('common.status') }}</th>
                  <th class="px-4 py-3.5">{{ $t('payment.required_date') }}</th>
                  <th class="px-4 py-3.5">{{ $t('payment.pay_date') }}</th>
                  <th class="px-4 py-3.5 text-right">{{ $t('payment.total_payment') }}</th>
                  <th class="px-4 py-3.5 text-right">{{ $t('payment.principal') }}</th>
                  <th class="px-4 py-3.5 text-right">{{ $t('payment.interest') }}</th>
                  <th class="px-4 py-3.5 text-right">{{ $t('payment.remaining_balance') }}</th>
                  <th class="px-4 py-3.5 text-center">{{ $t('common.actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
                <tr
                  v-for="table in filteredPayments"
                  :key="table.payId"
                  class="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td class="px-4 py-3 text-center font-bold text-neutral-900 dark:text-white">
                    {{ table.payNumber }}
                  </td>
                  <td class="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-400">
                    {{ table.payLoanNumber }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      :class="[
                        'inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border',
                        getStatusBadge(table.payStatus).bgClass
                      ]"
                    >
                      {{ getStatusBadge(table.payStatus).label }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300">
                    {{ formatDate(table.payPaymentRequiredDate) }}
                  </td>
                  <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">
                    {{ table.payPayDate ? formatDate(table.payPayDate) : '-' }}
                  </td>
                  <td class="px-4 py-3 text-right font-bold text-neutral-900 dark:text-white">
                    {{ formatCurrency(table.payTotalPayment) }}
                  </td>
                  <td class="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">
                    {{ formatCurrency(table.payPrincipal) }}
                  </td>
                  <td class="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">
                    {{ formatCurrency(table.payInterest) }}
                  </td>
                  <td class="px-4 py-3 text-right text-neutral-600 dark:text-neutral-400">
                    {{ formatCurrency(table.payRemainingBalance) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      v-if="table.payStatus !== 'PAID'"
                      @click="openPayModal(table)"
                      class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs transition-all shadow-sm"
                    >
                      Pay
                    </button>
                    <span v-else class="text-emerald-500 font-semibold text-xs flex items-center justify-center gap-1">
                      <span class="i-lucide-check-circle-2 w-3.5 h-3.5" />
                      Paid
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPayments.length === 0" class="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div class="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <span class="i-lucide-inbox w-6 h-6" />
          </div>
          <h4 class="text-base font-semibold text-neutral-900 dark:text-white">No payment records found</h4>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
            No schedule matches your current filter criteria or search query.
          </p>
        </div>

              <!-- KPI Summary Metrics Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Loan Amount Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Principal
            </span>
            <div class="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {{ formatCurrency(loanInfomationByIdData.loanInfoAmount) }}
            </div>
          </div>
         
        </div>

        <!-- Interest Rate Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Rate & Penalty
            </span>
            <div class="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
              {{ loanInfomationByIdData.loanInfoLoanFee }}%
            </div>
            <p class="text-[11px] text-neutral-400">Penalty: {{ loanInfomationByIdData.loanInfoPenaltyRate || 0 }}%</p>
          </div>
         
        </div>

        <!-- Start Date Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Start Date
            </span>
            <div class="text-lg font-bold text-neutral-900 dark:text-white">
              {{ formatDate(loanInfomationByIdData.loanInfoStartDate) }}
            </div>
          </div>
         
        </div>

        <!-- End Date Card -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              End Date
            </span>
            <div class="text-lg font-bold text-neutral-900 dark:text-white">
              {{ formatDate(loanInfomationByIdData.loanInfoEndDate) }}
            </div>
          </div>
          
        </div>
      </div>
      </div>
    </template>

    <!-- Payment Modal -->
      <UModal v-model:open="paymentModalOpen">
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UModal>
  </div>
</template>

<script setup lang="ts">
import {
  getLoanInformationByIdService,
  loanInfomationByIdData,
} from '~/model_dto/loan/loan_list/get_loan_list.dto';
import { updateStatusPaymentService } from '~/model_dto/payment/update_payment';
import { PaymentStatus } from '~/model_dto/payment/enum_payment';
import type { GetPaymentTableDTO } from '~/model_dto/payment/get_payment.dto';

definePageMeta({
  layout: 'customer',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const slug = computed(() => route.params.slug as string);
const toastAlert = useToastAlert();

const isLoading = ref(true);
const isSubmitting = ref(false);
const activeFilter = ref<string>('ALL');
const viewMode = ref<'grid' | 'table'>('grid');
const selectedPayment = ref<GetPaymentTableDTO | null>(null);
const paymentModalOpen = ref(false);
const payAmountInput = ref<number | string>('');
const openModal = ref(false);
// Fetch Data on mount or slug change
const fetchData = async () => {
  if (!slug.value) return;
  isLoading.value = true;
  try {
    await getLoanInformationByIdService(slug.value);
  } catch (err) {
    console.error('Error loading loan details:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

watch(slug, () => {
  fetchData();
});

// Computed Filtered Payments
const filteredPayments = computed(() => {
  const list = loanInfomationByIdData.value?.loanInfoPayment || [];
  if (activeFilter.value === 'ALL') return list;

  return list.filter(
    (p) => String(p.payStatus).toUpperCase() === activeFilter.value
  );
});

// Format Currency
const formatCurrency = (val?: number | string) => {
  if (val === undefined || val === null || isNaN(Number(val))) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(val));
};

// Format Date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

// Format Payment Type Name
const formatPaymentType = (type?: string) => {
  if (!type) return 'Installment';
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Status Badge Details
const getStatusBadge = (status?: string) => {
  const s = String(status || '').toUpperCase();
  switch (s) {
    case 'PAID':
      return {
        label: t('status.paid'),
        bgClass:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        icon: 'i-lucide-check-circle-2',
      };
    case 'PENDING':
      return {
        label: t('status.pending'),
        bgClass:
          'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        icon: 'i-lucide-clock',
      };
    case 'OVERDUE':
      return {
        label: t('status.overdue'),
        bgClass:
          'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
        icon: 'i-lucide-alert-circle',
      };
    default:
      return {
        label: status || t('common.no_data'),
        bgClass:
          'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
        icon: 'i-lucide-help-circle',
      };
  }
};

// Loan Overall Status Badge
const getLoanStatusBadge = (status?: string) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed') {
    return {
      label: t('status.completed'),
      class:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  return {
    label: t('status.in_payment'),
    class:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };
};

// Open Pay Modal
const openPayModal = (table: GetPaymentTableDTO) => {
  selectedPayment.value = table;
  payAmountInput.value = table.payTotalPayment || 0;
  paymentModalOpen.value = true;
};

// Confirm Payment Action
const confirmPayment = async () => {
  if (!selectedPayment.value) return;

  isSubmitting.value = true;
  try {
    await updateStatusPaymentService(
      {
        payStatus: PaymentStatus.PAID,
        payAmount: Number(payAmountInput.value),
      },
      selectedPayment.value.payId
    );

    toastAlert.showTaost(
      'Payment processed successfully!',
      'i-lucide-check-circle-2',
      3000,
      'success'
    );

    paymentModalOpen.value = false;
    await fetchData();
  } catch (error) {
    console.error('Error submitting payment:', error);
    toastAlert.showTaost(
      'Failed to submit payment',
      'i-lucide-alert-circle',
      3000,
      'error'
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>