<template>
  <div
    class="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 space-y-3.5"
  >
    <!-- Top Row: Borrower Info, Loan Number, Status & Dropdown Actions -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Borrower Avatar -->
        <div class="relative shrink-0">
          <img
            v-if="loan.loanInfoLoanerImage"
            :src="getImagePath(loan.loanInfoLoanerImage)"
            alt="Borrower"
            class="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800 shadow-sm"
          />
          <div
            v-else
            :class="[
              'w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-neutral-100 dark:ring-neutral-800 shadow-sm',
              avatarBg,
            ]"
          >
            {{ initials }}
          </div>
        </div>

        <!-- Name & Loan Number Badge -->
        <div class="min-w-0">
          <h4 class="font-bold text-sm text-neutral-900 dark:text-white truncate leading-snug">
            {{ loan.loanInfoLoaner || "Unknown Borrower" }}
          </h4>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              Loan {{ loan.loanInfoNumber || "N/A" }}
            </span>
            <span
              v-if="loan.loanInfoTypeName"
              class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary"
            >
              {{ loan.loanInfoTypeName }}
            </span>
          </div>
        </div>
      </div>

      <!-- Status Badge & Menu -->
      <div class="flex items-center gap-1.5 shrink-0">
        <span
          class="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border uppercase tracking-wider"
          :class="
            loan.loanInfoStatus === 'completed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
          "
        >
          {{ $t(`status.${(loan.loanInfoStatus || 'in_payment').toLowerCase()}`) }}
        </span>

        <UDropdownMenu v-if="items" :items="items">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="xs"
            class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
          />
        </UDropdownMenu>
      </div>
    </div>

    <!-- Loan Amount & Term Highlight Banner -->
    <div
      class="p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between"
    >
      <div>
        <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
          Loan Principal
        </span>
        <span class="text-xl font-extrabold font-mono text-primary">
          ${{ loan.loanInfoAmount }}
        </span>
      </div>

      <div class="text-right">
        <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
          Repayment Mode
        </span>
        <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 capitalize">
          {{ $t(`loan.${loan.loanInfoPaymentType?.toLowerCase()}`) || loan.loanInfoPaymentType }}
        </span>
      </div>
    </div>

    <!-- Rates & Breakdown Grid -->
    <div
      class="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-mono shadow-xs text-center"
    >
      <div>
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Loan Fee</span>
        <span class="font-bold text-neutral-800 dark:text-neutral-200">
          {{ loan.loanInfoLoanFee }}%
        </span>
      </div>
      <div>
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Penalty</span>
        <span class="font-bold text-rose-600 dark:text-rose-400">
          {{ loan.loanInfoPenaltyRate }}%
        </span>
      </div>
      <div>
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Duration</span>
        <span class="font-bold text-neutral-800 dark:text-neutral-200">
          {{ loan.loanInfoTotalMonth ? `${loan.loanInfoTotalMonth} M` : 'N/A' }}
        </span>
      </div>
    </div>

    <!-- Timeline (Dates) -->
    <div
      class="grid grid-cols-2 gap-2 text-xs p-2 rounded-lg bg-neutral-50/60 dark:bg-neutral-800/30 text-neutral-600 dark:text-neutral-400"
    >
      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span class="truncate">Start: {{ loan.loanInfoStartDate || "—" }}</span>
      </div>
      <div class="flex items-center gap-1.5 justify-end">
        <UIcon name="i-lucide-calendar-check" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span class="truncate">End: {{ loan.loanInfoEndDate || "—" }}</span>
      </div>
    </div>

    <!-- Loan Purpose (if provided) -->
    <div
      v-if="loan.loanInfoPurposeOfLoan"
      class="text-xs text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5"
    >
      <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
      <span class="line-clamp-2 leading-tight">{{ loan.loanInfoPurposeOfLoan }}</span>
    </div>

    <!-- Quick Action Footer Buttons -->
    <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end gap-2">
      <UButton
        color="neutral"
        variant="outline"
        size="xs"
        icon="i-lucide-eye"
        class="cursor-pointer font-medium"
        @click="$emit('viewDetail', loan)"
      >
        View Detail
      </UButton>

      <UButton
        color="primary"
        variant="soft"
        size="xs"
        icon="i-lucide-receipt"
        class="cursor-pointer font-semibold"
        @click="$emit('viewPayment', loan)"
      >
        Payment Info
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetLoanInformationDTO } from "~/model_dto/loan/loan_list/get_loan_list.dto";

interface Props {
  loan: GetLoanInformationDTO;
  items?: any[][];
}

const props = defineProps<Props>();

defineEmits<{
  (e: "viewDetail", loan: GetLoanInformationDTO): void;
  (e: "viewPayment", loan: GetLoanInformationDTO): void;
}>();

const initials = computed(() => {
  const name = props.loan.loanInfoLoaner || `L${props.loan.loanInfoNumber || ""}`;
  return name.trim().substring(0, 2).toUpperCase();
});

const avatarBg = computed(() => {
  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  ];
  const charCode = (props.loan.loanInfoLoaner || "L").charCodeAt(0);
  return colors[charCode % colors.length];
});
</script>