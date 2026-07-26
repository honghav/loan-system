<template>
  <div class="w-full space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Loan Settings</h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage loan configurations, interest rates, repayment cycles, and custom loan options.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search configurations..."
          class="w-full md:w-64"
          size="md"
        />
        <UButton
          label="Add Loan Type"
          icon="i-lucide-plus"
          color="primary"
          size="md"
          @click="
            () => {
              formLoanTypeIsOpen = true;
              loanTypeEditIsOpen = false;
            }
          "
        />
      </div>
    </div>

    <!-- Tabs Toggle -->
    <div class="flex border-b border-neutral-200 dark:border-neutral-800">
      <button
        @click="openLoanTable = false"
        :class="[
          'px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none',
          !openLoanTable
            ? 'border-primary text-primary dark:text-primary-400'
            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
        ]"
      >
        Loan List
      </button>
      <button
        @click="openLoanTable = true"
        :class="[
          'px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none',
          openLoanTable
            ? 'border-primary text-primary dark:text-primary-400'
            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
        ]"
      >
        Loan Configurations
      </button>
    </div>

    <!-- Main Content Section -->
    <div v-if="openLoanTable" class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-max table-auto text-left border-collapse">
          <thead>
            <tr class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <th class="px-6 py-4 w-20 text-center">Action</th>
              <th class="px-6 py-4">Payment Frequency</th>
              <th class="px-6 py-4">Repayment Cycle Day</th>
              <th class="px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr
              v-for="loanType in filteredLoanTypeData"
              :key="loanType.loanTypeId"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-150 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <!-- Action -->
              <td class="px-6 py-4 text-center">
                <UDropdownMenu :items="getItems(loanType)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  />
                </UDropdownMenu>
              </td>

              <!-- Frequency -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                  <span class="i-lucide-calendar-range w-3.5 h-3.5" />
                  {{ loanType.loanTypeFrequency }}
                </span>
              </td>

              <!-- Frequency Day -->
              <td class="px-6 py-4 font-mono font-medium text-neutral-900 dark:text-white">
                <div class="flex items-center gap-1.5">
                  <span class="i-lucide-clock text-neutral-400 w-4 h-4" />
                  Day {{ loanType.loanTypeFrequencyDay }} of cycle
                </div>
              </td>

              <!-- Description -->
              <td class="px-6 py-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                {{ loanType.loanTypeDescription || 'No description provided' }}
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredLoanTypeData.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <span class="i-lucide-file-text text-neutral-300 dark:text-neutral-700 w-12 h-12" />
                  <p class="text-base font-medium text-neutral-500 dark:text-neutral-400">No configurations found</p>
                  <p class="text-xs text-neutral-400 dark:text-neutral-600">
                    Try refining your search query or add a new custom loan configuration.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loan List Tab Placeholder -->
    <div v-else class="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-8 text-center shadow-sm">
      <div class="p-4 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-primary-400 mb-4 animate-pulse">
        <span class="i-lucide-wallet w-8 h-8 block" />
      </div>
      <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2">Loan Accounts Registry</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
        Active loan registers, schedule logs, and disbursement reports will be shown here.
      </p>
      <UButton
        label="Configure Loan Options"
        color="neutral"
        variant="outline"
        icon="i-lucide-settings"
        @click="openLoanTable = true"
      />
    </div>
  </div>

  <!-- Form Modal Loan Type -->
  <UModal
    :dismissible="true"
    v-model:open="formLoanTypeIsOpen"
    :title="loanTypeEditIsOpen ? 'Edit Loan Configuration' : 'Add Loan Configuration'"
    :ui="{ content: 'sm:max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl' }"
  >
    <template #body>
      <UForm :state="stateCreate" class="space-y-5" @submit="onSubmit">
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Define repayment terms below. These rules are used to auto-generate loan amortization schedules.
        </p>

        <div class="space-y-4">
          <!-- Frequency -->
          <UFormField
            label="Payment Frequency"
            name="loanTypeFrequency"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="stateCreate.loanTypeFrequency"
              placeholder="e.g. Monthly, Bi-weekly"
              icon="i-lucide-calendar-range"
              class="w-full"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>

          <!-- Frequency Day -->
          <UFormField
            label="Repayment Cycle Day"
            name="loanTypeFrequencyDay"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model.number="stateCreate.loanTypeFrequencyDay"
              placeholder="e.g. 15"
              icon="i-lucide-hash"
              class="w-full"
              type="number"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>

          <!-- Description -->
          <UFormField
            label="Description / Notes"
            name="loanTypeDescription"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="stateCreate.loanTypeDescription"
              placeholder="e.g. Standard monthly repayment cycle"
              icon="i-lucide-file-text"
              class="w-full"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>
        </div>

        <!-- Action Row -->
        <div class="flex justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="formLoanTypeIsOpen = false"
          />
          <UButton
            type="submit"
            color="primary"
            icon="i-lucide-check"
            class="px-4"
          >
            {{ loanTypeEditIsOpen ? "Save Changes" : "Create Configuration" }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import { createLoanTypeService, mapperCreateLoanType, type CreateLoanTypeDTO } from "~/model_dto/loan/loan_type/create_loan_type.dto";
import {
  getLoanTypeService,
  loanTypeData,
} from "~/model_dto/loan/loan_type/get_loan_type.dto";

const searchQuery = ref("");
const formLoanTypeIsOpen = ref(false);
const openLoanTable = ref(false);
const loanTypeEditIsOpen = ref(false);

onMounted(async () => {
  await getLoanTypeService();
});

// Filter loan configurations locally
const filteredLoanTypeData = computed(() => {
  if (!searchQuery.value) return loanTypeData.value;
  const q = searchQuery.value.toLowerCase().trim();
  return loanTypeData.value.filter(
    (t) =>
      t.loanTypeFrequency?.toLowerCase().includes(q) ||
      t.loanTypeDescription?.toLowerCase().includes(q) ||
      String(t.loanTypeFrequencyDay).includes(q)
  );
});

const getItems = (loanType: any) => [
  [
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error" as const,
      onSelect: async () => {
        console.log("Deleting loan type ID:", loanType.loanTypeId);
      },
    },
  ],
];

const stateCreate = reactive<CreateLoanTypeDTO>({
  loanTypeFrequency: "",
  loanTypeFrequencyDay: 0,
  loanTypeDescription: "",
  loanTypeUserId: "19ea1b72-6a4f-4b0b-a6a2-ae1b29de20eb",
});

async function onSubmit() {
  try {
    await createLoanTypeService(stateCreate);
    await getLoanTypeService();
    formLoanTypeIsOpen.value = false;
  } catch (error) {
    console.error("Error creating loan type:", error);
  }
}
</script>
