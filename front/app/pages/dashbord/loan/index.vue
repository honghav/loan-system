<template>
  <div class="w-full space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          {{ $t('loan.title') }}
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {{ $t('loan.subtitle') }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          :placeholder="$t('common.search')"
          class="w-full md:w-64"
          size="md"
        />
        <UButton
          v-if="openLoanTable"
          :label="$t('loan.create_loan_type')"
          icon="i-lucide-plus"
          color="primary"
          size="md"
          @click="openCreateLoanTypeModal"
        />
        <UButton
          v-else
          :label="$t('loan.create_loan')"
          icon="i-lucide-plus"
          color="primary"
          size="md"
          @click="
            () => {
              formLoanInfoIsOpen = true;
              loanInfoEditIsOpen = false;
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
            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300',
        ]"
      >
        {{ $t('loan.loan_list') }}
      </button>
      <button
        @click="openLoanTable = true"
        :class="[
          'px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none',
          openLoanTable
            ? 'border-primary text-primary dark:text-primary-400'
            : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300',
        ]"
      >
        {{ $t('loan.loan_configurations') }}
      </button>
    </div>

    <!-- Main Content Section: Loan Configurations Tab -->
    <div
      v-if="openLoanTable"
      class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-max table-auto text-left border-collapse">
          <thead>
            <tr
              class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              <th class="px-6 py-4 w-20 text-center">{{ $t('common.actions') }}</th>
              <th class="px-6 py-4">{{ $t('loan.loan_type') }}</th>
              <th class="px-6 py-4">{{ $t('loan.total_periods') }}</th>
              <th class="px-6 py-4">{{ $t('loan.purpose') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr
              v-for="loanType in filteredLoanTypeData"
              :key="loanType.loanTypeId"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-150 text-sm text-neutral-700 dark:text-neutral-300"
            >
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
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                >
                  <span class="i-lucide-calendar-range w-3.5 h-3.5" />
                  {{ loanType.loanTypeFrequency }}
                </span>
              </td>
              <td
                class="px-6 py-4 font-mono font-medium text-neutral-900 dark:text-white"
              >
                <div class="flex items-center gap-1.5">
                  <span class="i-lucide-clock text-neutral-400 w-4 h-4" />
                  Day {{ loanType.loanTypeFrequencyDay }} of cycle
                </div>
              </td>
              <td
                class="px-6 py-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate"
              >
                {{ loanType.loanTypeDescription || "No description provided" }}
              </td>
            </tr>
            <tr v-if="filteredLoanTypeData.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <div
                  class="flex flex-col items-center justify-center space-y-3"
                >
                  <span
                    class="i-lucide-file-text text-neutral-300 dark:text-neutral-700 w-12 h-12"
                  />
                  <p
                    class="text-base font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    No configurations found
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loan List Tab -->
    <div
      v-else
      class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-max table-auto text-left border-collapse">
          <thead>
            <tr
              class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              <th class="px-6 py-4 w-20 text-center">{{ $t('common.actions') }}</th>
              <th class="px-6 py-4">{{ $t('loan.loan_number') }}</th>
              <th class="px-6 py-4">{{ $t('customer.name') }}</th>
              <th class="px-6 py-4">{{ $t('loan.amount') }}</th>
              <th class="px-6 py-4">{{ $t('loan.loan_fee') }}</th>
              <th class="px-6 py-4">{{ $t('loan.penalty_rate') }}</th>
              <th class="px-6 py-4">{{ $t('loan.loan_type') }}</th>
              <th class="px-6 py-4">{{ $t('loan.start_date') }}</th>
              <th class="px-6 py-4">{{ $t('loan.end_date') }}</th>
              <th class="px-6 py-4">{{ $t('common.status') }}</th>
              <th class="px-6 py-4">{{ $t('loan.payment_type') }}</th>
              <th class="px-6 py-4">{{ $t('loan.purpose') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr
              v-for="loan in loanInfomationData"
              :key="loan.loanInfoId"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-150 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <td class="px-6 py-4 text-center">
                <UDropdownMenu :items="getItemsInfo(loan)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  />
                </UDropdownMenu>
              </td>
              <td
                class="px-6 py-4 font-semibold text-neutral-900 dark:text-white"
              >
                {{ loan.loanInfoNumber || "N/A" }}
              </td>
              <td
                class="px-6 py-4 font-semibold text-neutral-900 dark:text-white"
              >
                {{ loan.loanInfoLoaner || "N/A" }}
              </td>
              <td class="px-6 py-4 font-mono font-semibold text-primary">
                ${{ loan.loanInfoAmount }}
              </td>
              <td class="px-6 py-4 font-mono">{{ loan.loanInfoLoanFee }}%</td>
              <td class="px-6 py-4 font-mono">
                {{ loan.loanInfoPenaltyRate }}%
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800"
                >
                  {{ loan.loanInfoTypeName || "N/A" }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs">{{ loan.loanInfoStartDate }}</td>
              <td class="px-6 py-4 text-xs">{{ loan.loanInfoEndDate }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="
                    loan.loanInfoStatus === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                  "
                >
                  {{ $t(`status.${(loan.loanInfoStatus || 'in_payment').toLowerCase()}`) }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs capitalize">
                {{ $t(`loan.${loan.loanInfoPaymentType?.toLowerCase()}`) || loan.loanInfoPaymentType }}
              </td>
              <td class="px-6 py-4 text-xs max-w-xs truncate">
                {{ loan.loanInfoPurposeOfLoan }}
              </td>
            </tr>
            <tr v-if="loanInfomationData.length === 0">
              <td colspan="11" class="px-6 py-12 text-center text-neutral-500">
                No loan records found. Click "Add Loan Information" to create
                one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal 1: Loan Type Form -->
  <UModal
    :dismissible="true"
    v-model:open="formLoanTypeIsOpen"
    :title="loanTypeEditIsOpen ? $t('loan.edit_loan_type') : $t('loan.create_loan_type')"
    :ui="{
      content:
        'sm:max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl',
    }"
  >
    <template #body>
      <LoanTypeFormComponent
        :loan-type-edit-is-open="loanTypeEditIsOpen"
        :editing-loan-type="editingLoanType"
        @close="formLoanTypeIsOpen = false"
      />
    </template>
  </UModal>

  <!-- Modal 2: Loan Information Form -->
  <!-- Modal 2: Loan Information Form (Modern Horizontal Style) -->
  <UModal
    :dismissible="false"
    v-model:open="formLoanInfoIsOpen"
    :title="loanInfoEditIsOpen ? $t('loan.edit_loan') : $t('loan.create_loan')"
    :ui="{
      content:
        'sm:max-w-4xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden',
    }"
  >
    <template #body>
      <LoanInformationFormComponent @close="formLoanInfoIsOpen = false" />
    </template>
  </UModal>

  <!-- View Modal Loan Information -->
  <UModal
    :dismissible="true"
    v-model:open="viewLoandetailIsOpen"
    :ui="{
      content:
        'max-w-none w-full max-w-5xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden',
    }"
  >
    <template #body>
      <LoanInformationDetailComponent @close="viewLoandetailIsOpen = false" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import {
  getLoanInformationService,
  deleteLoanInformationService,
  loanInfomationData,
  type GetLoanInformationDTO,
  getLoanInformationByIdService,
} from "~/model_dto/loan/loan_list/get_loan_list.dto";
import {
  createLoanInformationService,
  type CreateLoanInformationDTO,
} from "~/model_dto/loan/loan_list/create_loan_list.dto";
import {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from "~/model_dto/loan/loan_list/enum_loan_lnformation";
import {
  createLoanTypeService,
  updateLoanTypeService,
  deleteLoanTypeService,
  type CreateLoanTypeDTO,
} from "~/model_dto/loan/loan_type/create_loan_type.dto";
import {
  getLoanTypeService,
  loanTypeData,
  type GetLoanTypeDTO,
} from "~/model_dto/loan/loan_type/get_loan_type.dto";
import {
  getCustomerService,
  customerData,
} from "~/model_dto/customer/getCustomer.dto";
import { currentUserData } from "~/model_dto/auth/get_current_user.dto";
import LoanInformationFormComponent from "~/components/LoanInformationFormComponent.vue";
import LoanTypeFormComponent from "~/components/LoanTypeFormComponent.vue";
import LoanInformationDetailComponent from "~/components/LoanInformationDetailComponent.vue";
import getToken from "~/constants/helper/getToken";
// ==================================//
// Loan Information Action Control   //
// ==================================//
const formLoanInfoIsOpen = ref(false);
const loanInfoEditIsOpen = ref(false);
const viewLoandetailIsOpen = ref(false);
const token = ref(getToken());



const getItemsInfo = (loanInfor: GetLoanInformationDTO) => [
  [
    {
      label: "View Loan Detail",
      icon: "i-lucide-eye",
      onSelect: async () => {
        viewLoandetailIsOpen.value = true;
        if (loanInfor.loanInfoId) {
          await getLoanInformationByIdService(loanInfor.loanInfoId);
        }
      },
    },
    {
      label: "Loan Payment",
      icon: "i-lucide-eye",
      onSelect: async () => {
        if (!loanInfor?.loanInfoId) return;
window.open(`../customer/${loanInfor.loanInfoId}`, '_blank');      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error" as const,
      onSelect: async () => {
        if (loanInfor.loanInfoId) {
          await deleteLoanInformationService(loanInfor.loanInfoId, token.value as string);
        }
      },
    },
  ],
];

// ===========================//
// Loan Type Action Control   //
// ===========================//
const searchQuery = ref("");
const formLoanTypeIsOpen = ref(false);
const openLoanTable = ref(false);
const loanTypeEditIsOpen = ref(false);
const editingLoanType = ref<GetLoanTypeDTO | null>(null);

function openCreateLoanTypeModal() {
  loanTypeEditIsOpen.value = false;
  editingLoanType.value = null;
  formLoanTypeIsOpen.value = true;
}

function openEditLoanTypeModal(loanType: GetLoanTypeDTO) {
  loanTypeEditIsOpen.value = true;
  editingLoanType.value = loanType;
  formLoanTypeIsOpen.value = true;
}

// Filter loan configurations locally
const filteredLoanTypeData = computed(() => {
  if (!searchQuery.value) return loanTypeData.value;
  const q = searchQuery.value.toLowerCase().trim();
  return loanTypeData.value.filter(
    (t) =>
      t.loanTypeFrequency?.toLowerCase().includes(q) ||
      t.loanTypeDescription?.toLowerCase().includes(q) ||
      String(t.loanTypeFrequencyDay).includes(q),
  );
});

const getItems = (loanType: GetLoanTypeDTO) => [
  [
    {
      label: "Edit",
      icon: "i-lucide-pencil",
      onSelect: () => {
        openEditLoanTypeModal(loanType);
      },
    },
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error" as const,
      onSelect: async () => {
        if (loanType.loanTypeId) {
          await deleteLoanTypeService(loanType.loanTypeId);
        }
      },
    },
  ],
];



// ==================================//
// Formatters & UI Helpers           //
// ==================================//





onMounted(async () => {
  await Promise.all([
    getLoanInformationService(token.value as string),
    getLoanTypeService(token.value as string),
    getCustomerService(token.value as string),
  ]);
});
</script>
