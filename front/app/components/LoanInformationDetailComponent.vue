<template>
     <div class="space-y-6 p-2 sm:p-4">
        <!-- Header Banner: Customer Info & Key Loan Metrics -->
        <div
          class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-850 dark:to-neutral-800 p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
        >
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <!-- Left: Avatar & Customer Profile -->
            <div class="flex items-center gap-4">
              <div class="relative flex-shrink-0">
                <NuxtImg
                  v-if="loanInfomationByIdData?.loanInfoLoanerImage"
                  :src="
                    getImagePath(loanInfomationByIdData?.loanInfoLoanerImage)
                  "
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-primary-500/20 shadow-md"
                />
                <div
                  v-else
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-2xl shadow-sm border border-primary-200 dark:border-primary-800"
                >
                  {{ loanInfomationByIdData?.loanInfoLoaner?.charAt(0) || "C" }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2.5">
                  <h3
                    class="text-xl font-bold text-neutral-900 dark:text-white"
                  >
                    {{ loanInfomationByIdData?.loanInfoLoaner || "N/A" }}
                  </h3>
                  <span
                    :class="[
                      'px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize',
                      getLoanStatusBadge(
                        loanInfomationByIdData?.loanInfoStatus,
                      ),
                    ]"
                  >
                    {{
                      loanInfomationByIdData?.loanInfoStatus?.replace(
                        "_",
                        " ",
                      ) || "N/A"
                    }}
                  </span>
                </div>
                <p
                  class="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1"
                >
                  <span class="i-lucide-file-text w-3.5 h-3.5" />
                  Purpose:
                  <span
                    class="font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {{
                      loanInfomationByIdData?.loanInfoPurposeOfLoan ||
                      "Not specified"
                    }}
                  </span>
                </p>
                <div class="flex items-center gap-2 pt-1 text-xs">
                  <span
                    class="px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    {{ loanInfomationByIdData?.loanInfoTypeName || "Standard" }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium capitalize"
                  >
                    {{
                      loanInfomationByIdData?.loanInfoPaymentType?.replace(
                        "_",
                        " ",
                      ) || "N/A"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right: Principal Highlights Card -->
            <div
              class="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
            >
              <span
                class="text-xs font-medium uppercase tracking-wider text-neutral-400"
              >
                Loan Principal
              </span>
              <span
                class="text-2xl sm:text-3xl font-extrabold font-mono text-primary-600 dark:text-primary-400"
              >
                {{ formatCurrency(loanInfomationByIdData?.loanInfoAmount) }}
              </span>
              <span
                class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5"
              >
                Interest Fee:
                <strong
                  class="text-neutral-700 dark:text-neutral-300 font-mono"
                >
                  {{ loanInfomationByIdData?.loanInfoLoanFee }}%
                </strong>
              </span>
            </div>
          </div>
        </div>

        <!-- 4-Column Summary Key Details -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            class="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/60 space-y-1"
          >
            <div
              class="flex items-center gap-1.5 text-neutral-400 text-xs font-medium"
            >
              <span class="i-lucide-percent w-3.5 h-3.5 text-amber-500" />
              Penalty Rate
            </div>
            <p
              class="text-sm font-semibold font-mono text-neutral-900 dark:text-white"
            >
              {{ loanInfomationByIdData?.loanInfoPenaltyRate ?? 0 }}%
            </p>
          </div>

          <div
            class="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/60 space-y-1"
          >
            <div
              class="flex items-center gap-1.5 text-neutral-400 text-xs font-medium"
            >
              <span class="i-lucide-calendar-days w-3.5 h-3.5 text-blue-500" />
              Start Date
            </div>
            <p class="text-sm font-semibold text-neutral-900 dark:text-white">
              {{ formatDate(loanInfomationByIdData?.loanInfoStartDate) }}
            </p>
          </div>

          <div
            class="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/60 space-y-1"
          >
            <div
              class="flex items-center gap-1.5 text-neutral-400 text-xs font-medium"
            >
              <span
                class="i-lucide-calendar-check w-3.5 h-3.5 text-emerald-500"
              />
              End Date
            </div>
            <p class="text-sm font-semibold text-neutral-900 dark:text-white">
              {{ formatDate(loanInfomationByIdData?.loanInfoEndDate) }}
            </p>
          </div>

          <div
            class="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/60 space-y-1"
          >
            <div
              class="flex items-center gap-1.5 text-neutral-400 text-xs font-medium"
            >
              <span class="i-lucide-layers w-3.5 h-3.5 text-purple-500" />
              Total Installments
            </div>
            <p
              class="text-sm font-semibold font-mono text-neutral-900 dark:text-white"
            >
              {{ loanInfomationByIdData?.loanInfoPayment?.length || 0 }} Cycles
            </p>
          </div>
        </div>

        <!-- Repayment Schedule Table Section -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="i-lucide-receipt w-5 h-5 text-primary-500" />
              <h4 class="text-base font-bold text-neutral-900 dark:text-white">
                Repayment Schedule
              </h4>
            </div>
            <span
              class="text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium"
            >
              {{ loanInfomationByIdData?.loanInfoPayment?.length || 0 }}
              Schedules
            </span>
          </div>

          <!-- Schedule Table -->
          <div
            class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
          >
            <div class="overflow-x-auto max-h-80 scrollbar-thin">
              <table
                class="w-full min-w-max table-auto text-left border-collapse"
              >
                <thead
                  class="sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-800/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800"
                >
                  <tr
                    class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                  >
                    <th class="px-4 py-3 text-center w-12">#</th>
                    <th class="px-4 py-3">Required Date</th>
                    <th class="px-4 py-3 text-right">Total</th>
                    <th class="px-4 py-3 text-right">Beginning</th>
                    <th class="px-4 py-3 text-right">Principal</th>
                    <th class="px-4 py-3 text-right">Interest</th>
                    <th class="px-4 py-3 text-right">Remaining</th>
                    <th class="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-sm"
                >
                  <tr
                    v-for="(
                      payment, index
                    ) in loanInfomationByIdData?.loanInfoPayment"
                    :key="payment.payId || index"
                    class="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors duration-150 text-neutral-700 dark:text-neutral-300"
                  >
                    <td
                      class="px-4 py-3 text-center font-mono text-xs text-neutral-400"
                    >
                      {{ index + 1 }}
                    </td>
                    <td class="px-4 py-3 font-medium text-xs">
                      {{ formatDate(payment.payPaymentRequiredDate) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono font-semibold text-neutral-900 dark:text-white"
                    >
                      {{ formatCurrency(payment.payTotalPayment) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono text-neutral-600 dark:text-neutral-400"
                    >
                      {{ formatCurrency(payment.payBeginningBalance) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400"
                    >
                      {{ formatCurrency(payment.payPrincipal) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono text-amber-600 dark:text-amber-400"
                    >
                      {{ formatCurrency(payment.payInterest) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono font-medium text-neutral-900 dark:text-white"
                    >
                      {{ formatCurrency(payment.payRemainingBalance) }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span
                        :class="[
                          'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider',
                          getPaymentStatusBadges(payment.payStatus),
                        ]"
                      >
                        {{ $t(`status.${(payment.payStatus || 'PENDING').toLowerCase()}`) }}
                      </span>
                    </td>
                  </tr>

                  <tr
                    v-if="
                      !loanInfomationByIdData?.loanInfoPayment ||
                      loanInfomationByIdData?.loanInfoPayment?.length === 0
                    "
                  >
                    <td
                      colspan="8"
                      class="px-6 py-10 text-center text-neutral-400 dark:text-neutral-500"
                    >
                      <div
                        class="flex flex-col items-center justify-center space-y-2"
                      >
                        <span
                          class="i-lucide-calendar-x w-8 h-8 text-neutral-300 dark:text-neutral-700"
                        />
                        <p class="text-sm">No payment schedules available</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer Action -->
        <div
          class="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800"
        >
          <UButton
            label="Close"
            color="neutral"
            variant="outline"
            size="md"
            icon="i-lucide-x"
            @click="closeModal()"
          />
        </div>
      </div>
</template>
<script setup lang="ts">
import formatCurrency from '~/constants/helper/formatCurrency';
import formatDate from '~/constants/helper/formatDate';
import getLoanStatusBadge from '~/constants/helper/getLoanStatusBadge';
import getPaymentStatusBadges from '~/constants/helper/getPaymentStatusBadge';
import { loanInfomationByIdData } from '~/model_dto/loan/loan_list/get_loan_list.dto';
const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};


</script>