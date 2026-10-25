<template>
  <div
    class="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 space-y-3"
  >
    <!-- Top Row: Frequency Title, Cycle Badge & Actions -->
    <div class="flex items-start justify-between gap-3">
      <div class="space-y-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
          >
            <UIcon name="i-lucide-calendar-range" class="w-3.5 h-3.5" />
            {{ loanType.loanTypeFrequency || "Custom Frequency" }}
          </span>

          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
          >
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-neutral-400" />
            Day {{ loanType.loanTypeFrequencyDay }} of cycle
          </span>
        </div>
      </div>

      <!-- Action Dropdown Menu -->
      <UDropdownMenu v-if="items" :items="items">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          size="xs"
          class="hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
        />
      </UDropdownMenu>
    </div>

    <!-- Description / Purpose -->
    <div class="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-300">
      <p class="leading-relaxed">
        {{ loanType.loanTypeDescription || "No description provided for this loan type configuration." }}
      </p>
    </div>

    <!-- Action Buttons Footer -->
    <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end gap-2">
      <UButton
        color="neutral"
        variant="outline"
        size="xs"
        icon="i-lucide-pencil"
        class="cursor-pointer font-medium"
        @click="$emit('edit', loanType)"
      >
        Edit
      </UButton>

      <UButton
        color="error"
        variant="soft"
        size="xs"
        icon="i-lucide-trash"
        class="cursor-pointer font-medium text-red-600 dark:text-red-400"
        @click="$emit('delete', loanType)"
      >
        Delete
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetLoanTypeDTO } from "~/model_dto/loan/loan_type/get_loan_type.dto";

interface Props {
  loanType: GetLoanTypeDTO;
  items?: any[][];
}

defineProps<Props>();

defineEmits<{
  (e: "edit", loanType: GetLoanTypeDTO): void;
  (e: "delete", loanType: GetLoanTypeDTO): void;
}>();
</script>