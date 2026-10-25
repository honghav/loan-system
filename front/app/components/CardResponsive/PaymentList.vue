<template>
  <div
    class="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 space-y-3.5"
  >
    <!-- Top Bar: Avatar, Info, Loan No, Status & Menu -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Customer / Profile Avatar -->
        <div class="relative shrink-0">
          <img
            v-if="payment.payCustomerImage"
            :src="getImagePath(payment.payCustomerImage)"
            alt="Customer"
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
          <span
            class="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
          >
            #{{ payment.payNumber }}
          </span>
        </div>

        <!-- Name & Loan Number -->
        <div class="min-w-0">
          <h4 class="font-bold text-sm text-neutral-900 dark:text-white truncate leading-snug">
            {{ payment.payCustomerName || 'Payment #' + payment.payNumber }}
          </h4>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span
              v-if="payment.payLoanNumber"
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              Loan {{ payment.payLoanNumber }}
            </span>
          </div>
        </div>
      </div>

      <!-- Status Badge & Dropdown Actions -->
      <div class="flex items-center gap-1.5 shrink-0">
        <span
          class="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border uppercase tracking-wider"
          :class="getPaymentStatusBadges(payment.payStatus)"
        >
          {{ payment.payStatus || 'PENDING' }}
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

    <!-- Amount & Due Date Banner -->
    <div
      class="p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between"
    >
      <div>
        <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
          Total Payment
        </span>
        <span class="text-xl font-extrabold font-mono text-neutral-900 dark:text-white">
          {{ formatCurrency(payment.payTotalPayment) }}
        </span>
      </div>

      <div class="text-right">
        <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
          Due Date
        </span>
        <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-mono flex items-center gap-1 justify-end">
          <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-neutral-400" />
          {{ formatDate(payment.payPaymentRequiredDate) }}
        </span>
      </div>
    </div>

    <!-- Financial Breakdown Grid -->
    <div
      class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-mono shadow-xs"
    >
      <div>
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Principal</span>
        <span class="font-bold text-emerald-600 dark:text-emerald-400">
          {{ formatCurrency(payment.payPrincipal) }}
        </span>
      </div>
      <div>
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Interest</span>
        <span class="font-bold text-amber-600 dark:text-amber-400">
          {{ formatCurrency(payment.payInterest) }}
        </span>
      </div>
      <div class="pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Beginning</span>
        <span class="font-medium text-neutral-600 dark:text-neutral-400">
          {{ formatCurrency(payment.payBeginningBalance) }}
        </span>
      </div>
      <div class="pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
        <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Remaining</span>
        <span class="font-bold text-neutral-900 dark:text-white">
          {{ formatCurrency(payment.payRemainingBalance) }}
        </span>
      </div>
    </div>

    <!-- Paid Date Indicator (if paid) -->
    <div
      v-if="payment.payPayDate"
      class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60"
    >
      <UIcon name="i-lucide-check-circle-2" class="w-4 h-4 text-emerald-500 shrink-0" />
      <span>Paid on: {{ formatDate(payment.payPayDate) }}</span>
    </div>

    <!-- Quick Status Transition Buttons -->
    <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
      <span class="text-[11px] font-semibold text-neutral-400">Quick Actions:</span>
      <div class="flex items-center gap-1.5">
        <UButton
          v-if="payment.payStatus !== PaymentStatus.PAID"
          color="neutral"
          variant="outline"
          size="xs"
          icon="i-lucide-check"
          class="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-semibold cursor-pointer"
          @click="$emit('statusUpdate', payment, PaymentStatus.PAID)"
        >
          Mark Paid
        </UButton>

        <UButton
          v-if="payment.payStatus !== PaymentStatus.PENDING"
          color="neutral"
          variant="outline"
          size="xs"
          icon="i-lucide-clock"
          class="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[11px] font-semibold cursor-pointer"
          @click="$emit('statusUpdate', payment, PaymentStatus.PENDING)"
        >
          Pending
        </UButton>

        <UButton
          v-if="payment.payStatus !== PaymentStatus.OVERDUE"
          color="neutral"
          variant="outline"
          size="xs"
          icon="i-lucide-alert-triangle"
          class="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold cursor-pointer"
          @click="$emit('statusUpdate', payment, PaymentStatus.OVERDUE)"
        >
          Overdue
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import formatCurrency from "~/constants/helper/formatCurrency";
import formatDate from "~/constants/helper/formatDate";
import getPaymentStatusBadges from "~/constants/helper/getPaymentStatusBadge";
import { PaymentStatus } from "~/model_dto/payment/enum_payment";
import type { GetPaymentTableDTO } from "~/model_dto/payment/get_payment.dto";

interface Props {
  payment: GetPaymentTableDTO;
  items?: any[][];
}

const props = defineProps<Props>();

defineEmits<{
  (e: "statusUpdate", payment: GetPaymentTableDTO, status: PaymentStatus): void;
}>();

const initials = computed(() => {
  const name = props.payment.payCustomerName || `P${props.payment.payNumber}`;
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
  const charCode = (props.payment.payCustomerName || "P").charCodeAt(0);
  return colors[charCode % colors.length];
});
</script>