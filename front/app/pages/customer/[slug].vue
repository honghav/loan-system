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
                    {{ loanInfomationByIdData.loanInfoNumber }}
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
                      class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-black font-medium text-xs transition-all shadow-sm"
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
      <div class="h-full p-4 bg-neutral-50 dark:bg-neutral-900">
        <div class="flex justify-between items-center mb-4 border-b-2 py-4 border-black">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Payment Method</h1>
          <button @click="paymentModalOpen = false" class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-black font-medium text-xs transition-all shadow-sm">
            Close
          </button>
        </div>
        <div class="mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-center">
          <p class="text-xs text-neutral-500 font-semibold uppercase">Amount to Pay</p>
          <p class="text-2xl font-extrabold text-neutral-900 dark:text-white mt-0.5">
            {{ formatCurrency(payAmountInput) }}
          </p>
        </div>
        <div class="grid grid-cols-1 gap-4">
            <UButton
              v-for="item in paymentMethodData"
              :key="item.value"
              :label="item.label"
              @click="selectedPaymentMethod = item.value"
              class="p-4 border border-neutral-200/80 transition-all cursor-pointer justify-center"
              :class="selectedPaymentMethod === item.value 
                ? 'bg-primary-600 text-black font-bold shadow-sm border-2 border-black' 
                : 'bg-white text-black hover:bg-neutral-100'"
            />
          </div>
          <UButton
            label="PayNow"
            @click="payNow()"
            class="my-5 py-4 w-full  border border-neutral-200/80 transition-all cursor-pointer justify-center bg-black text-white hover:text-white"
            
            />
          <!-- <div v-if="comingSoonMessage = true" class="p-4 bg-red-200 rounded-lg border border-red-600 w-full">
            <p class="text-red-500 font-bold" >
              Comming Soon...................................
            </p>
          </div>
          <div v-if="paymentRequiredMessage = true" class="p-4 bg-red-200 rounded-lg border border-red-600 w-full">
            <p class="text-red-500 font-bold" >
              Payment Method Is Required...................................
            </p>
          </div> -->
      </div>
    </template>
  </UModal>
<!-- Bakong Modal -->
        <UModal v-model:open="bakongQrModal">
    <template #content>
         <div class="h-full p-4 bg-neutral-50 dark:bg-neutral-900">
        <div class="flex justify-between items-center mb-4 border-b-2 py-4 border-black">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Bakong QR</h1>
          <button @click="bakongQrModal = false" class="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-black font-medium text-xs transition-all shadow-sm">
            Close
          </button>
        </div></div>
    </template></UModal>
        
    <!-- Cutluy Modal -->
    <UModal v-model:open="cutluyModal">
      <template #content>
        <div class="h-full p-6 bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full mx-auto">
          <!-- Modal Header -->
          <div class="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                C
              </div>
              <h2 class="text-xl font-bold text-neutral-900 dark:text-white">Cutluy Payment</h2>
            </div>
            <button 
              @click="cutluyModal = false" 
              class="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-medium text-xs transition-all shadow-sm"
            >
              Close
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="cutluyLoading" class="py-12 flex flex-col items-center justify-center gap-3">
            <span class="i-lucide-loader-2 w-10 h-10 animate-spin text-primary-600" />
            <p class="text-sm text-neutral-500 font-medium">Generating Cutluy QR Code...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="cutluyError" class="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
              <span class="i-lucide-alert-circle w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-neutral-900 dark:text-white">Failed to generate QR</h3>
              <p class="text-xs text-neutral-500 mt-1 max-w-xs break-words">{{ cutluyError }}</p>
            </div>
            <button 
              @click="handleCutluyCheckout" 
              class="mt-2 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-all"
            >
              Try Again
            </button>
          </div>

          <!-- QR Display Content -->
          <div v-else-if="cutLuyResponse" class="py-4 flex flex-col items-center">
            <!-- Amount & Status -->
            <div class="text-center mb-4">
              <p class="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Total Amount</p>
              <p class="text-3xl font-extrabold text-neutral-900 dark:text-white mt-0.5">
                {{ cutLuyResponse.currency === 'KHR' ? '៛' : '$' }}{{ Number(cutLuyResponse.amount || payAmountInput || 0).toLocaleString() }}
              </p>
              <span class="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Scan to Pay
              </span>
            </div>

            <!-- QR Code Container Card -->
            <div class="bg-white p-4 rounded-2xl border border-neutral-200 shadow-md flex flex-col items-center justify-center">
              <img 
                v-if="generatedQrDataUrl" 
                :src="generatedQrDataUrl" 
                alt="Scan Cutluy QR" 
                class="w-56 h-56 object-contain rounded-lg"
              />
              <div v-else class="w-56 h-56 flex items-center justify-center bg-neutral-50 text-neutral-400 text-xs">
                No QR Code Image
              </div>
              
              <p v-if="cutLuyResponse.reference_id || cutLuyResponse.id" class="text-[11px] text-neutral-400 mt-2 font-mono text-center">
                Ref: {{ cutLuyResponse.reference_id || cutLuyResponse.id }}
              </p>
            </div>

            <!-- Actions -->
            <!-- <div class="w-full mt-5 space-y-2">
              <a 
                v-if="cutLuyResponse.checkout_url"
                :href="cutLuyResponse.checkout_url"
                target="_blank"
                class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Open Checkout Link</span>
                <span class="i-lucide-external-link w-4 h-4" />
              </a>

              <button 
              @click="handleCutluyCheckStatus(cutLuyResponse?.id)"
                class="w-full py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs rounded-xl transition-all"
              >
                Done
              </button>
              <span 
              v-if="cutLuyCheckStatusResponse"
                class="w-full py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs rounded-xl transition-all"
              >
                Payment Status: {{cutLuyCheckStatusResponse.status}}
            </span>
            </div> -->
          </div>
        </div>
      </template>
    </UModal>

    <!-- Custom Payment Amount Modal -->
    <UModal v-model:open="paymentAmountModalOpen">
      <template #content>
        <div class="h-full p-6 bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full mx-auto">
          <!-- Modal Header -->
          <div class="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 class="text-xl font-bold text-neutral-900 dark:text-white">Payment Amount</h2>
            <button 
              @click="paymentAmountModalOpen = false" 
              class="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-medium text-xs transition-all shadow-sm"
            >
              Close
            </button>
          </div>

          <div class="py-4 space-y-4">
            <!-- Payment Info Breakdown -->
            <div v-if="selectedPayment" class="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl space-y-2 text-xs">
              <div class="flex justify-between text-neutral-500">
                <span>Total Repayment:</span>
                <span class="font-bold text-neutral-900 dark:text-white">{{ formatCurrency(selectedPayment.payTotalPayment) }}</span>
              </div>
              <div class="flex justify-between text-neutral-500">
                <span>Interest Amount:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(selectedPayment.payInterest) }}</span>
              </div>
              <div class="flex justify-between text-neutral-500">
                <span>Principal Amount:</span>
                <span class="font-bold text-neutral-900 dark:text-white">{{ formatCurrency(selectedPayment.payPrincipal) }}</span>
              </div>
            </div>

            <!-- Quick Selection Preset Buttons -->
            <div v-if="selectedPayment" class="flex gap-2">
              <button 
                type="button"
                @click="payAmountInput = selectedPayment.payInterest" 
                class="flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all"
                :class="Number(payAmountInput) === Number(selectedPayment.payInterest)
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/40 dark:text-emerald-400 font-bold' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-transparent hover:bg-neutral-200'"
              >
                Interest Only ({{ formatCurrency(selectedPayment.payInterest) }})
              </button>
              <button 
                type="button"
                @click="payAmountInput = selectedPayment.payTotalPayment" 
                class="flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all"
                :class="Number(payAmountInput) === Number(selectedPayment.payTotalPayment)
                  ? 'bg-primary-500/10 text-primary-600 border-primary-500/40 dark:text-primary-400 font-bold' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-transparent hover:bg-neutral-200'"
              >
                Full Payment ({{ formatCurrency(selectedPayment.payTotalPayment) }})
              </button>
            </div>

            <!-- Payment Amount Input Field -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Enter Payment Amount ($)
              </label>
              <UInput 
                v-model="payAmountInput" 
                type="number" 
                min="0.01"
                step="0.01"
                placeholder="Enter amount to pay" 
                class="w-full"
              />
            </div>

            <!-- Action Button -->
            <button 
              @click="proceedToPaymentMethod"
              class="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
            >
              <span>Choose Payment Method</span>
              <span class="i-lucide-arrow-right w-4 h-4" />
            </button>
          </div>
        </div>
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
import { LoanInformationPaymentType } from '~/model_dto/loan/loan_list/enum_loan_lnformation';
import type { GetPaymentTableDTO } from '~/model_dto/payment/get_payment.dto';
import { paymentMethodData } from '~/model_dto/payment_method/payment_method.data';
import type { CutLuyCheckStatusResDTO, CutLuyResDTO } from '~/model_dto/payment_method/cutluy/cutluy.dto';
import QRCode from 'qrcode';

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
const paymentAmountModalOpen = ref(false);
const paymentModalOpen = ref(false);
const payAmountInput = ref<number | string>('');
const openModal = ref(false);
const selectedPaymentMethod = ref<string>('');

const bakongQrModal = ref(false);
const cutluyModal = ref(false);
const deeplinkModal = ref(false);
const comingSoonMessage = ref(false)
const paymentRequiredMessage = ref(false)
const cutLuyResponse = ref<CutLuyResDTO | null>(null);
const cutLuyCheckStatusResponse = ref<CutLuyCheckStatusResDTO | null>(null);
const cutluyLoading = ref(false);
const cutluyError = ref<string | null>(null);
const generatedQrDataUrl = ref<string>('');
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
  comingSoonMessage.value = false;
  paymentRequiredMessage.value = false;
});

watch(slug, () => {
  fetchData();
});

// Computed Filtered Payments
const filteredPayments = computed(() => {
  const list = loanInfomationByIdData.value?.loanInfoPayment?.sort((a, b) => b.payNumber - a.payNumber) || [];
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


const payNow = () => {
  switch (selectedPaymentMethod.value) {
    case 'bakong':
      // payWithCash()
      bakongQrModal.value = true;
      paymentModalOpen.value = false
      console.log("Payment Method Value Cash:")
      break;
      
      case 'cutluy':
        cutluyModal.value = true;
        handleCutluyCheckout()
        console.log("Payment Method Value: Bank")
      

      // payWithBank()
      break;
      
      case 'deeplink':
        comingSoonMessage.value = true
      console.log("Payment Method Value: QR Code")

      // payWithQr()
      break;
      
      default:
        paymentRequiredMessage.value = true
      console.log("Payment Method Is Required")

      break;
  }

}


// Cutluy Handle
let cutluySocket: WebSocket | null = null;
let cutluyPollingInterval: ReturnType<typeof setInterval> | null = null;

function isCutluyPaid(status: string | number | undefined | null): boolean {
  if (status === undefined || status === null) return false;
  if (typeof status === 'number') return status === 1 || status === 200;
  const s = String(status).trim().toLowerCase();
  return s === 'paid' || s === 'success' || s === 'approved' || s === 'completed' || s === '1';
}

function stopCutluyStatusListener() {
  if (cutluySocket) {
    cutluySocket.close();
    cutluySocket = null;
  }
  if (cutluyPollingInterval) {
    clearInterval(cutluyPollingInterval);
    cutluyPollingInterval = null;
  }
}

async function handleCutluyPaidSuccess() {
  stopCutluyStatusListener();
  cutluyModal.value = false;
  toastAlert.showTaost(
    'Payment processed successfully!',
    'i-lucide-check-circle-2',
    3000,
    'success'
  );
  if (selectedPayment.value) {
    await confirmPayment();
  }
}

function initCutluyWebSocket(id: string) {
  stopCutluyStatusListener();
  if (!id) return;

  // Try WebSocket connection to Cutluy Payment Gateway
  try {
    const wsUrl = `wss://cutluy.com/ws/${id}`;
    cutluySocket = new WebSocket(wsUrl);

    cutluySocket.onopen = () => {
      console.log("Cutluy WebSocket connected for ID:", id);
      cutluySocket?.send(JSON.stringify({ action: "subscribe", id }));
    };

    cutluySocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Cutluy WebSocket message:", data);
        if (data) {
          cutLuyCheckStatusResponse.value = data;
          if (isCutluyPaid(data.status)) {
            await handleCutluyPaidSuccess();
          }
        }
      } catch (err) {
        console.error("Cutluy WS message parse error:", err);
      }
    };

    cutluySocket.onerror = (err) => {
      console.warn("Cutluy WS error, using status check polling fallback:", err);
    };

    cutluySocket.onclose = () => {
      console.log("Cutluy WS connection closed");
    };
  } catch (err) {
    console.warn("Cutluy WebSocket init error:", err);
  }

  // Fallback status check polling every 3 seconds
  cutluyPollingInterval = setInterval(() => {
    if (cutluyModal.value && id) {
      handleCutluyCheckStatus(id);
    } else {
      stopCutluyStatusListener();
    }
  }, 3000);
}

async function handleCutluyCheckout() {
  cutluyLoading.value = true;
  cutluyError.value = null;
  generatedQrDataUrl.value = '';
  cutLuyResponse.value = null;
  cutLuyCheckStatusResponse.value = null;

  const amountToPay = Number(payAmountInput.value || selectedPayment.value?.payTotalPayment || 0.1);
  // const payload = { amount: amountToPay, reference_id: `order_${Date.now()}` };
  const payload = { amount: 0.1, reference_id: `order_${Date.now()}` };

  try {
    const response: CutLuyResDTO = await $fetch("/api/cutluy-checkout", {
      method: "POST",
      body: payload,
    });

    cutLuyResponse.value = response;
    console.log("Cutluy response:", cutLuyResponse.value);

    if (response?.qrImage) {
      if (response.qrImage.startsWith('data:') || response.qrImage.startsWith('http')) {
        generatedQrDataUrl.value = response.qrImage;
      } else {
        generatedQrDataUrl.value = `data:image/png;base64,${response.qrImage}`;
      }
    } else if (response?.qr_string) {
      generatedQrDataUrl.value = await QRCode.toDataURL(response.qr_string, { width: 300, margin: 2 });
    }

    if (response?.id) {
      initCutluyWebSocket(response.id);
    }
  } catch (error: any) {
    console.error("Cutluy checkout error:", error);
    cutluyError.value = error?.data?.statusMessage || error?.message || "Failed to connect to Cutluy Payment Gateway";
  } finally {
    cutluyLoading.value = false;
  }
}

// Cutluy Check Status Handle
async function handleCutluyCheckStatus(id?: string) {
  if (!id) {
    console.warn("Cutluy payment ID is required to check status");
    return;
  }

  try {
    const response: CutLuyCheckStatusResDTO = await $fetch("/api/cutluy-checkout", {
      method: "GET",
      query: { id },
    });

    if (response) {
      cutLuyCheckStatusResponse.value = response;
      if (isCutluyPaid(response.status)) {
        await handleCutluyPaidSuccess();
      }
    }
    console.log("Cutluy response Check Status:", response);
  } catch (error: any) {
    console.error("Cutluy check status error:", error);
    cutluyError.value = error?.data?.statusMessage || error?.message || "Failed to check status from Cutluy Payment Gateway";
  } 
}

watch(cutluyModal, (isOpen) => {
  if (!isOpen) {
    stopCutluyStatusListener();
  }
});

onUnmounted(() => {
  stopCutluyStatusListener();
});



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

// Open Pay Modal based on Payment Type
const openPayModal = (table: GetPaymentTableDTO) => {
  selectedPayment.value = table;

  const paymentType = String(
    table?.paymentType || 
    table?.loanInformation?.paymentType || 
    loanInfomationByIdData.value?.loanInfoPaymentType || 
    ''
  ).toLowerCase();

  // If installment_payment: show custom amount input modal (defaulting to interest amount)
  if (
    paymentType === 'installment_payment' || 
    paymentType === LoanInformationPaymentType.INSTALLMENT_PAYMENT
  ) {
    payAmountInput.value = table.payInterest || table.payTotalPayment || 0;
    paymentAmountModalOpen.value = true;
  } else {
    // For another type: value is Total Repayment, proceed directly to payment methods
    payAmountInput.value = table.payTotalPayment || 0;
    paymentModalOpen.value = true;
  }
};

// Proceed from Custom Amount Modal to Payment Methods Modal
const proceedToPaymentMethod = () => {
  if (!payAmountInput.value || Number(payAmountInput.value) <= 0) {
    toastAlert.showTaost(
      'Please enter a valid payment amount',
      'i-lucide-alert-circle',
      3000,
      'error'
    );
    return;
  }
  paymentAmountModalOpen.value = false;
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