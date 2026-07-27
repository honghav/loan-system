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
          Loan Settings
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage loan configurations, interest rates, repayment cycles, and
          custom loan options.
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
          v-if="openLoanTable"
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
        <UButton
          v-else
          label="Add Loan Information"
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
        Loan List
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
        Loan Configurations
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
              <td class="px-6 py-4 font-mono font-medium text-neutral-900 dark:text-white">
                <div class="flex items-center gap-1.5">
                  <span class="i-lucide-clock text-neutral-400 w-4 h-4" />
                  Day {{ loanType.loanTypeFrequencyDay }} of cycle
                </div>
              </td>
              <td class="px-6 py-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                {{ loanType.loanTypeDescription || "No description provided" }}
              </td>
            </tr>
            <tr v-if="filteredLoanTypeData.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <span class="i-lucide-file-text text-neutral-300 dark:text-neutral-700 w-12 h-12" />
                  <p class="text-base font-medium text-neutral-500 dark:text-neutral-400">
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
              <th class="px-6 py-4 w-20 text-center">Action</th>
              <th class="px-6 py-4">Loaner</th>
              <th class="px-6 py-4">Amount</th>
              <th class="px-6 py-4">Loan Fee</th>
              <th class="px-6 py-4">Penalty Rate</th>
              <th class="px-6 py-4">Loan Type</th>
              <th class="px-6 py-4">Start Date</th>
              <th class="px-6 py-4">End Date</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Payment Type</th>
              <th class="px-6 py-4">Purpose</th>
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
              <td class="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                {{ loan.loanInfoLoaner || 'N/A' }}
              </td>
              <td class="px-6 py-4 font-mono font-semibold text-primary">
                ${{ loan.loanInfoAmount }}
              </td>
              <td class="px-6 py-4 font-mono">${{ loan.loanInfoLoanFee }}</td>
              <td class="px-6 py-4 font-mono">{{ loan.loanInfoPenaltyRate }}%</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800">
                  {{ loan.loanInfoTypeName || 'N/A' }}
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
                  {{ loan.loanInfoStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs capitalize">{{ loan.loanInfoPaymentType }}</td>
              <td class="px-6 py-4 text-xs max-w-xs truncate">{{ loan.loanInfoPurposeOfLoan }}</td>
            </tr>
            <tr v-if="loanInfomationData.length === 0">
              <td colspan="11" class="px-6 py-12 text-center text-neutral-500">
                No loan records found. Click "Add Loan Information" to create one.
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
    :title="loanTypeEditIsOpen ? 'Edit Loan Type' : 'Add Loan Type'"
    :ui="{
      content:
        'sm:max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl',
    }"
  >
    <template #body>
      <UForm
        :state="stateCreateLoanType"
        class="space-y-5"
        @submit="onSubmitLoanType"
      >
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Define loan configuration terms and frequency cycles.
        </p>

        <div class="space-y-4">
          <UFormField
            label="Payment Frequency"
            name="loanTypeFrequency"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="stateCreateLoanType.loanTypeFrequency"
              placeholder="e.g. Monthly, Bi-weekly"
              icon="i-lucide-calendar-range"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Repayment Cycle Day"
            name="loanTypeFrequencyDay"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model.number="stateCreateLoanType.loanTypeFrequencyDay"
              placeholder="e.g. 15"
              icon="i-lucide-hash"
              class="w-full"
              type="number"
            />
          </UFormField>

          <UFormField
            label="Description / Notes"
            name="loanTypeDescription"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="stateCreateLoanType.loanTypeDescription"
              placeholder="e.g. Standard monthly repayment cycle"
              icon="i-lucide-file-text"
              class="w-full"
            />
          </UFormField>
        </div>

        <div
          class="flex justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800"
        >
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

  <!-- Modal 2: Loan Information Form -->
  <UModal
    :dismissible="true"
    v-model:open="formLoanInfoIsOpen"
    :title="loanInfoEditIsOpen ? 'Edit Loan Information' : 'Add Loan Information'"
    :ui="{
      content:
        'sm:max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl',
    }"
  >
    <template #body>
      <UForm
        :state="stateCreateLoanInfor"
        class="space-y-5"
        @submit="onSubmitLoanInfo"
      >
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Enter loan details including customer, loan configuration type, amount, fees, and schedule.
        </p>

        <div class="space-y-4">
          <!-- Customer Selection -->
          <UFormField
            label="Customer / Borrower"
            name="loanInfoLoanerId"
            required
            class="flex flex-col gap-1"
          >
            <select
              v-model="stateCreateLoanInfor.loanInfoLoanerId"
              required
              class="w-full h-10 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm"
            >
              <option value="" disabled>Select Customer</option>
              <option v-for="c in customerData" :key="c.cusId" :value="c.cusId">
                {{ c.cusName }} ({{ c.cusPhone }})
              </option>
            </select>
          </UFormField>

          <!-- Loan Type Selection -->
          <UFormField
            label="Loan Configuration Type"
            name="loanInfoTypeId"
            required
            class="flex flex-col gap-1"
          >
            <select
              v-model="stateCreateLoanInfor.loanInfoTypeId"
              required
              class="w-full h-10 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm"
            >
              <option value="" disabled>Select Loan Type</option>
              <option v-for="t in loanTypeData" :key="t.loanTypeId" :value="t.loanTypeId">
                {{ t.loanTypeFrequency }} - {{ t.loanTypeDescription }} ({{ t.loanTypeFrequencyDay }} days)
              </option>
            </select>
          </UFormField>

          <!-- Loan Amount -->
          <UFormField
            label="Loan Amount ($)"
            name="loanInfoAmount"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model.number="stateCreateLoanInfor.loanInfoAmount"
              type="number"
              placeholder="e.g. 5000"
              icon="i-lucide-dollar-sign"
              class="w-full"
            />
          </UFormField>

          <!-- Fee and Penalty -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Loan Fee ($)"
              name="loanInfoLoanFee"
              required
              class="flex flex-col gap-1"
            >
              <UInput
                v-model.number="stateCreateLoanInfor.loanInfoLoanFee"
                type="number"
                placeholder="e.g. 50"
                icon="i-lucide-receipt"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Penalty Rate (%)"
              name="loanInfoPenaltyRate"
              required
              class="flex flex-col gap-1"
            >
              <UInput
                v-model.number="stateCreateLoanInfor.loanInfoPenaltyRate"
                type="number"
                placeholder="e.g. 5"
                icon="i-lucide-percent"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Payment Type and Status -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Payment Type"
              name="loanInfoPaymentType"
              required
              class="flex flex-col gap-1"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoPaymentType"
                class="w-full h-10 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm"
              >
                <option value="installment_payment">Installment Payment</option>
                <option value="completed_payment">Completed Payment</option>
                <option value="fee_payment">Fee Payment</option>
              </select>
            </UFormField>

            <UFormField
              label="Status"
              name="loanInfoStatus"
              required
              class="flex flex-col gap-1"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoStatus"
                class="w-full h-10 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm"
              >
                <option value="in_payment">In Payment</option>
                <option value="completed">Completed</option>
              </select>
            </UFormField>
          </div>

          <!-- Start Date and End Date -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Start Date"
              name="loanInfoStartDate"
              required
              class="flex flex-col gap-1"
            >
              <UInput
                v-model="stateCreateLoanInfor.loanInfoStartDate"
                type="date"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="End Date"
              name="loanInfoEndDate"
              required
              class="flex flex-col gap-1"
            >
              <UInput
                v-model="stateCreateLoanInfor.loanInfoEndDate"
                type="date"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Purpose of Loan -->
          <UFormField
            label="Purpose of Loan"
            name="loanInfoPurposeOfLoan"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="stateCreateLoanInfor.loanInfoPurposeOfLoan"
              placeholder="e.g. Business expansion"
              icon="i-lucide-file-text"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Action Row -->
        <div
          class="flex justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800"
        >
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="formLoanInfoIsOpen = false"
          />
          <UButton
            type="submit"
            color="primary"
            icon="i-lucide-check"
            class="px-4"
          >
            {{ loanInfoEditIsOpen ? "Save Changes" : "Create Record" }}
          </UButton>
        </div>
      </UForm>
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
  type CreateLoanTypeDTO,
} from "~/model_dto/loan/loan_type/create_loan_type.dto";
import {
  getLoanTypeService,
  loanTypeData,
} from "~/model_dto/loan/loan_type/get_loan_type.dto";
import {
  getCustomerService,
  customerData,
} from "~/model_dto/customer/getCustomer.dto";
import { currentUserData } from "~/model_dto/auth/get_current_user.dto";

// ==================================//
// Loan Information Action Control   //
// ==================================//
const formLoanInfoIsOpen = ref(false);
const loanInfoEditIsOpen = ref(false);

const stateCreateLoanInfor = reactive<CreateLoanInformationDTO>({
  loanInfoAmount: 0,
  loanInfoPurposeOfLoan: "",
  loanInfoLoanFee: 0,
  loanInfoPenaltyRate: 0,
  loanInfoStartDate: "",
  loanInfoEndDate: "",
  loanInfoStatus: LoanInformationStatus.IN_PAYMENT,
  loanInfoPaymentType: LoanInformationPaymentType.INSTALLMENT_PAYMENT,
  loanInfoLoanerId: "",
  loanInfoTypeId: "",
  loanInfoUserId: "",
});

async function onSubmitLoanInfo() {
  try {
    if (currentUserData.value?.Id) {
      stateCreateLoanInfor.loanInfoUserId = currentUserData.value.Id;
    }
    await createLoanInformationService(stateCreateLoanInfor);
    await getLoanInformationService();
    formLoanInfoIsOpen.value = false;
  } catch (error) {
    console.error("Error creating loan information:", error);
  }
}

const getItemsInfo = (loanInfor: GetLoanInformationDTO) => [
  [
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error" as const,
      onSelect: async () => {
        if (confirm("Are you sure you want to delete this loan record?")) {
          await deleteLoanInformationService(loanInfor.loanInfoId);
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

const stateCreateLoanType = reactive<CreateLoanTypeDTO>({
  loanTypeFrequency: "",
  loanTypeFrequencyDay: 0,
  loanTypeDescription: "",
  loanTypeUserId: "",
});

async function onSubmitLoanType() {
  try {
    if (currentUserData.value?.Id) {
      stateCreateLoanType.loanTypeUserId = currentUserData.value.Id;
    }
    await createLoanTypeService(stateCreateLoanType);
    await getLoanTypeService();
    formLoanTypeIsOpen.value = false;
  } catch (error) {
    console.error("Error creating loan type:", error);
  }
}

onMounted(async () => {
  await Promise.all([
    getLoanInformationService(),
    getLoanTypeService(),
    getCustomerService(),
  ]);
});
</script>
