<template>
  <div class="space-y-8 pb-12">
    <!-- Header & Action Bar -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
    >
      <div>
        <div class="flex items-center gap-2">
          <h1
            class="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
          >
            Dashboard Overview
          </h1>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
          >
            Live Analytics
          </span>
        </div>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Real-time summary of loan portfolios, scheduled collections, and customer performance.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300"
        >
          <span class="i-lucide-calendar w-4 h-4 text-neutral-400" />
          {{ currentDateFormatted }}
        </div>
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="isLoading"
          class="rounded-xl font-medium"
          @click="refreshData"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Loading Skeleton State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 6"
        :key="i"
        class="h-36 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
      />
    </div>

    <template v-else-if="kpi">
      <!-- Top KPI Stat Cards (6 Grid Layout) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- 1. Total Customers -->
        <div
          class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/20 dark:from-indigo-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-indigo-100 dark:border-indigo-900/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Total Customers
            </span>
            <div class="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <span class="i-lucide-users w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black font-mono text-neutral-900 dark:text-white">
              {{ kpi.totalCustomers }}
            </span>
            <span class="text-xs font-semibold text-neutral-500">Registered</span>
          </div>
          <div class="mt-3 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
            Active customer portfolio
          </div>
        </div>

        <!-- 2. Total Active Loans -->
        <div
          class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/20 dark:from-emerald-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active Loans
            </span>
            <div class="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <span class="i-lucide-file-text w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black font-mono text-neutral-900 dark:text-white">
              {{ kpi.totalActiveLoans }}
            </span>
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              ${{ formatNumber(kpi.totalDisbursedAmount) }} Disbursed
            </span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-neutral-500">
            <span>Completed: {{ kpi.totalCompletedLoans }}</span>
            <span class="font-medium text-emerald-600 dark:text-emerald-400">In Payment</span>
          </div>
        </div>

        <!-- 3. This Week Collection -->
        <div
          class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/20 dark:from-amber-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-amber-100 dark:border-amber-900/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              This Week Collection
            </span>
            <div class="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
              <span class="i-lucide-calendar-range w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black font-mono text-neutral-900 dark:text-white">
              {{ formatCurrency(kpi.thisWeekPaymentTotal) }}
            </span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-medium">
            <span>{{ kpi.thisWeekPaymentCount }} Payments Scheduled</span>
            <span>Current Week</span>
          </div>
        </div>

        <!-- 4. This Month Collection -->
        <div
          class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-sky-50/20 dark:from-sky-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-sky-100 dark:border-sky-900/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              This Month Collection
            </span>
            <div class="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400">
              <span class="i-lucide-calendar-days w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black font-mono text-neutral-900 dark:text-white">
              {{ formatCurrency(kpi.thisMonthPaymentTotal) }}
            </span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-sky-700 dark:text-sky-300 font-medium">
            <span>{{ kpi.thisMonthPaymentCount }} Payments Scheduled</span>
            <span>Current Month</span>
          </div>
        </div>

        <!-- 5. Total Collected Revenue -->
        <div
          class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/20 dark:from-purple-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-purple-100 dark:border-purple-900/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Total Revenue Collected
            </span>
            <div class="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <span class="i-lucide-sparkles w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black font-mono text-neutral-900 dark:text-white">
              {{ formatCurrency(kpi.totalCollectedAmount) }}
            </span>
          </div>
          <div class="mt-3 text-xs text-purple-700 dark:text-purple-300 font-medium">
            All settled & paid transactions
          </div>
        </div>

        <!-- 6. Total Overdue Payments -->
        <div
          class="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-rose-50/20 dark:from-rose-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-rose-100 dark:border-rose-900/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Overdue Payments
            </span>
            <div class="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
              <span class="i-lucide-alert-triangle w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
              {{ formatCurrency(kpi.totalOverdueAmount) }}
            </span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 font-medium">
            <span>{{ kpi.totalOverdueCount }} Payments Overdue</span>
            <span class="font-bold text-rose-600">Requires Action</span>
          </div>
        </div>
      </div>

      <!-- Main Section Grid: Top Active Customers & Distribution Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Customers with Active Big Loans (2 Cols) -->
        <div
          class="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden"
        >
          <div class="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span class="i-lucide-trophy w-5 h-5 text-amber-500" />
                Top Customers with Active Loans
              </h2>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Active borrowers sorted by highest principal loan amount.
              </p>
            </div>
            <NuxtLink
              to="/dashbord/loan"
              class="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
            >
              View All Loans <span class="i-lucide-arrow-right w-3.5 h-3.5" />
            </NuxtLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                  <th class="px-6 py-3.5">Customer</th>
                  <th class="px-6 py-3.5">Loan Number</th>
                  <th class="px-6 py-3.5 text-right">Loan Amount</th>
                  <th class="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                <tr
                  v-for="item in topActiveLoanCustomers"
                  :key="item.loanId"
                  class="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="getImagePath(item.image)"
                        alt="Customer Avatar"
                        class="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                      />
                      <div>
                        <p class="font-bold text-neutral-900 dark:text-white leading-tight">
                          {{ item.customerName }}
                        </p>
                        <p class="text-xs text-neutral-400 font-mono">
                          {{ item.phoneNumber || 'No phone' }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                      {{ item.loanNumber || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {{ formatCurrency(item.loanAmount) }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      In Payment
                    </span>
                  </td>
                </tr>

                <tr v-if="topActiveLoanCustomers.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-xs text-neutral-400">
                    No active loan customers found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Portfolio Breakdown Card (1 Col) -->
        <div
          class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm p-6 space-y-6"
        >
          <div>
            <h2 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span class="i-lucide-pie-chart w-5 h-5 text-indigo-500" />
              Portfolio Distribution
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Breakdown of loan and payment status allocations.
            </p>
          </div>

          <!-- Loan Status Breakdown -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Loan Statuses
            </h3>
            <div v-for="st in loanStatusSummary" :key="st.status" class="space-y-1.5">
              <div class="flex items-center justify-between text-xs font-semibold">
                <span class="capitalize text-neutral-700 dark:text-neutral-300">
                  {{ st.status.replace('_', ' ') }} ({{ st.count }})
                </span>
                <span class="font-mono text-neutral-900 dark:text-white">
                  {{ formatCurrency(st.totalAmount) }}
                </span>
              </div>
              <div class="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="st.status === 'in_payment' ? 'bg-emerald-500' : 'bg-indigo-500'"
                  :style="{
                    width: `${kpi.totalDisbursedAmount ? Math.min((st.totalAmount / kpi.totalDisbursedAmount) * 100, 100) : 0}%`,
                  }"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Payment Table Statuses
            </h3>
            <div v-for="pst in paymentStatusSummary" :key="pst.status" class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <div class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :class="{
                    'bg-amber-500': pst.status === 'PENDING',
                    'bg-emerald-500': pst.status === 'PAID',
                    'bg-rose-500': pst.status === 'OVERDUE',
                    'bg-neutral-400': pst.status === 'CANCELLED',
                  }"
                />
                <span class="font-bold text-neutral-800 dark:text-neutral-200">
                  {{ pst.status }}
                </span>
                <span class="text-neutral-400">({{ pst.count }})</span>
              </div>
              <span class="font-mono font-bold text-neutral-900 dark:text-white">
                {{ formatCurrency(pst.totalAmount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly & Monthly Scheduled Payments Widget Section -->
      <div
        class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden"
      >
        <!-- Widget Header with Period Controls -->
        <div
          class="p-6 border-b border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span class="i-lucide-clock w-5 h-5 text-amber-500" />
                Scheduled Collections & Payments
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              >
                {{ paymentsData?.count || 0 }} Items
              </span>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Showing scheduled payment due dates for
              <span class="font-bold text-neutral-800 dark:text-neutral-200">
                {{ paymentsData?.startDate }} to {{ paymentsData?.endDate }}
              </span>
            </p>
          </div>

          <!-- Controls: Week / Month Toggle & Month Picker -->
          <div class="flex items-center gap-3">
            <div class="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-medium">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg transition-all"
                :class="
                  activePeriod === 'week'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                "
                @click="setPeriod('week')"
              >
                This Week
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg transition-all"
                :class="
                  activePeriod === 'month'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                "
                @click="setPeriod('month')"
              >
                Monthly
              </button>
            </div>

            <!-- Month Input if Monthly Mode -->
            <input
              v-if="activePeriod === 'month'"
              v-model="selectedMonth"
              type="month"
              class="px-3 py-1.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="onMonthChange"
            />
          </div>
        </div>

        <!-- Payments Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800"
              >
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4">Loan Number</th>
                <th class="px-6 py-4 text-center">#</th>
                <th class="px-6 py-4">Required Due Date</th>
                <th class="px-6 py-4 text-right">Total Payment</th>
                <th class="px-6 py-4 text-right">Principal</th>
                <th class="px-6 py-4 text-right">Interest</th>
                <th class="px-6 py-4 text-right">Remaining</th>
                <th class="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
              <tr
                v-for="p in paymentsData?.payments"
                :key="p.id"
                class="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getImagePath(p.loanInformation?.customer?.image)"
                      alt="Customer"
                      class="w-9 h-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                    />
                    <div>
                      <p class="font-bold text-neutral-900 dark:text-white leading-tight">
                        {{ p.loanInformation?.customer?.customerName || 'N/A' }}
                      </p>
                      <p class="text-xs text-neutral-400 font-mono">
                        {{ p.loanInformation?.customer?.phoneNumber || '' }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {{ p.loanInformation?.loanNumber || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center font-mono text-xs text-neutral-500">
                  #{{ p.totalPaymentNo }}
                </td>
                <td class="px-6 py-4 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {{ formatDate(p.paymentRequiredDate) }}
                </td>
                <td class="px-6 py-4 text-right font-mono font-bold text-neutral-900 dark:text-white">
                  {{ formatCurrency(p.totalPayment) }}
                </td>
                <td class="px-6 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(p.principal) }}
                </td>
                <td class="px-6 py-4 text-right font-mono text-amber-600 dark:text-amber-400">
                  {{ formatCurrency(p.interest) }}
                </td>
                <td class="px-6 py-4 text-right font-mono font-semibold text-neutral-500">
                  {{ formatCurrency(p.remainingBalance) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="[
                      'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider',
                      getPaymentBadgeClass(p.status),
                    ]"
                  >
                    {{ p.status || 'PENDING' }}
                  </span>
                </td>
              </tr>

              <tr v-if="!paymentsData?.payments || paymentsData.payments.length === 0">
                <td colspan="9" class="px-6 py-12 text-center text-neutral-400">
                  <div class="flex flex-col items-center justify-center space-y-2">
                    <span class="i-lucide-calendar-x w-10 h-10 text-neutral-300 dark:text-neutral-700" />
                    <p class="text-sm font-medium">No scheduled payments found for this period.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  dashboardOverview,
  dashboardPayments,
  isDashboardLoading,
  fetchDashboardOverview,
  fetchDashboardPayments,
} from '~/model_dto/dashboard/get_dashboard.dto';

const activePeriod = ref<'week' | 'month'>('week');
const selectedMonth = ref<string>(new Date().toISOString().substring(0, 7)); // YYYY-MM

const isLoading = computed(() => isDashboardLoading.value);
const overview = computed(() => dashboardOverview.value);
const kpi = computed(() => overview.value?.kpi);
const topActiveLoanCustomers = computed(() => overview.value?.topActiveLoanCustomers || []);
const loanStatusSummary = computed(() => overview.value?.loanStatusSummary || []);
const paymentStatusSummary = computed(() => overview.value?.paymentStatusSummary || []);
const paymentsData = computed(() => dashboardPayments.value);

const currentDateFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

async function refreshData() {
  await Promise.all([
    fetchDashboardOverview(),
    fetchDashboardPayments(activePeriod.value, activePeriod.value === 'month' ? selectedMonth.value : undefined),
  ]);
}

async function setPeriod(period: 'week' | 'month') {
  activePeriod.value = period;
  await fetchDashboardPayments(
    period,
    period === 'month' ? selectedMonth.value : undefined,
  );
}

async function onMonthChange() {
  if (activePeriod.value === 'month' && selectedMonth.value) {
    await fetchDashboardPayments('month', selectedMonth.value);
  }
}

function formatCurrency(val?: number): string {
  if (val === undefined || val === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val);
}

function formatNumber(val?: number): string {
  if (val === undefined || val === null) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getPaymentBadgeClass(status?: string) {
  switch (status?.toUpperCase()) {
    case 'PAID':
    case 'COMPLETED':
      return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'PENDING':
      return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'OVERDUE':
      return 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    case 'CANCELLED':
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 line-through opacity-75';
    default:
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  }
}

onMounted(async () => {
  await refreshData();
});
</script>
