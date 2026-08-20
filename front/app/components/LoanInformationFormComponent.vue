<template>
          <UForm
        :state="stateCreateLoanInfor"
        class="space-y-6 p-1"
        @submit="onSubmitLoanInfo"
      >
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Configure borrower details, financial amounts, payment schedules, and
          terms in this modern horizontal layout.
        </p>

        <!-- Horizontal Multi-Column Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column: Borrower & Financial Details -->
          <div
            class="space-y-5 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800"
          >
            <div
              class="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400"
            >
              <span class="i-lucide-user-check w-4 h-4" />
              {{ $t('loan.borrower_and_amount_section') }}
            </div>

            <!-- Customer Selection -->
            <UFormField
              :label="$t('customer.name')"
              name="loanInfoLoanerId"
              required
              class="flex flex-col gap-1 text-xs"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoLoanerId"
                required
                class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-medium"
              >
                <option value="" disabled>{{ $t('loan.select_customer') }}</option>
                <option
                  v-for="c in customerData"
                  :key="c.cusId"
                  :value="c.cusId"
                >
                  {{ c.cusName }} ({{ c.cusPhone }})
                </option>
              </select>
            </UFormField>

            <!-- Loan Type Selection -->
            <UFormField
              :label="$t('loan.loan_type')"
              name="loanInfoTypeId"
              required
              class="flex flex-col gap-1 text-xs"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoTypeId"
                required
                class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-medium"
              >
                <option value="" disabled>{{ $t('loan.select_loan_type') }}</option>
                <option
                  v-for="t in loanTypeData"
                  :key="t.loanTypeId"
                  :value="t.loanTypeId"
                >
                  {{ t.loanTypeFrequency }} - {{ t.loanTypeDescription }} ({{
                    t.loanTypeFrequencyDay
                  }}
                  days)
                </option>
              </select>
            </UFormField>

            <!-- Loan Amount & Fee Grid -->
            <div class="grid grid-cols-2 gap-3">
              <UFormField
                :label="$t('loan.amount')"
                name="loanInfoAmount"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <UInput
                  v-model.number="stateCreateLoanInfor.loanInfoAmount"
                  type="number"
                  placeholder="5000"
                  icon="i-lucide-dollar-sign"
                  class="w-full font-mono"
                  size="md"
                />
              </UFormField>

              <UFormField
                :label="$t('loan.loan_fee')"
                name="loanInfoLoanFee"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <UInput
                  v-model.number="stateCreateLoanInfor.loanInfoLoanFee"
                  type="number"
                  placeholder="50"
                  icon="i-lucide-receipt"
                  class="w-full font-mono"
                  size="md"
                />
              </UFormField>
            </div>

            <!-- Purpose of Loan -->
            <UFormField
              :label="$t('loan.purpose')"
              name="loanInfoPurposeOfLoan"
              required
              class="flex flex-col gap-1 text-xs"
            >
              <UInput
                v-model="stateCreateLoanInfor.loanInfoPurposeOfLoan"
                placeholder="e.g. Business expansion"
                icon="i-lucide-file-text"
                class="w-full"
                size="md"
              />
            </UFormField>
          </div>

          <!-- Right Column: Terms, Dates & Status -->
          <div
            class="space-y-5 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800"
          >
            <div
              class="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-indigo-500"
            >
              <span class="i-lucide-calendar-clock w-4 h-4" />
              {{ $t('loan.terms_dates_status_section') }}
            </div>

            <!-- Penalty & Payment Type Grid -->
            <div class="grid grid-cols-2 gap-3">
              <UFormField
                :label="$t('loan.penalty_rate')"
                name="loanInfoPenaltyRate"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <UInput
                  v-model.number="stateCreateLoanInfor.loanInfoPenaltyRate"
                  type="number"
                  placeholder="5"
                  icon="i-lucide-percent"
                  class="w-full font-mono"
                  size="md"
                />
              </UFormField>

              <UFormField
                :label="$t('loan.payment_type')"
                name="loanInfoPaymentType"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <select
                  v-model="stateCreateLoanInfor.loanInfoPaymentType"
                  class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-medium"
                >
                  <option value="installment_payment">
                    {{ $t('loan.installment_payment') }}
                  </option>
                  <option value="completed_payment">
                    {{ $t('loan.completed_payment') }}
                  </option>
                  <option value="fee_payment">
                    {{ $t('loan.fee_payment') }}
                  </option>
                </select>
              </UFormField>
            </div>

            <!-- Dates Grid -->
            <div
              :class="[
                stateCreateLoanInfor.loanInfoPaymentType?.toLowerCase() ===
                'completed_payment'
                  ? 'grid grid-cols-2 gap-3'
                  : 'space-y-4',
              ]"
            >
              <UFormField
                :label="$t('loan.start_date')"
                name="loanInfoStartDate"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <UInput
                  v-model="stateCreateLoanInfor.loanInfoStartDate"
                  type="date"
                  class="w-full font-mono"
                  size="md"
                />
              </UFormField>

              <UFormField
                v-if="
                  stateCreateLoanInfor.loanInfoPaymentType ===
                    'completed_payment' ||
                  stateCreateLoanInfor.loanInfoPaymentType?.toLowerCase() ===
                    'completed_payment'
                "
                :label="$t('loan.end_date')"
                name="loanInfoEndDate"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <UInput
                  v-model="stateCreateLoanInfor.loanInfoEndDate"
                  type="date"
                  class="w-full font-mono"
                  size="md"
                />
              </UFormField>
            </div>
          </div>
        </div>

        <!-- Action Row -->
        <div
          class="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800"
        >
          <UButton
            :label="$t('common.cancel')"
            color="neutral"
            variant="ghost"
            @click="$emit('close')"
          />
          <UButton
            type="submit"
            color="primary"
            icon="i-lucide-check"
            class="px-6"
          >
            {{ loanInfoEditIsOpen ? $t('common.save') : $t('loan.create_loan') }}
          </UButton>
        </div>
      </UForm>
</template>
<script setup lang="ts">
import { currentUserData } from '~/model_dto/auth/get_current_user.dto';
import { customerData } from '~/model_dto/customer/getCustomer.dto';
import { createLoanInformationService, type CreateLoanInformationDTO } from '~/model_dto/loan/loan_list/create_loan_list.dto';
import { LoanInformationPaymentType, LoanInformationStatus } from '~/model_dto/loan/loan_list/enum_loan_lnformation';
import { getLoanInformationService } from '~/model_dto/loan/loan_list/get_loan_list.dto';
import { loanTypeData } from '~/model_dto/loan/loan_type/get_loan_type.dto';

const stateCreateLoanInfor = reactive<CreateLoanInformationDTO>({
  loanInfoAmount: 0,
  loanInfoPurposeOfLoan: "",
  loanInfoLoanFee: 0,
  loanInfoPenaltyRate: 0,
  loanInfoStartDate: "",
  loanInfoEndDate: undefined,
  loanInfoStatus: LoanInformationStatus.IN_PAYMENT,
  loanInfoPaymentType: LoanInformationPaymentType.INSTALLMENT_PAYMENT,
  loanInfoLoanerId: "",
  loanInfoTypeId: "",
  loanInfoUserId: "",
});
const formLoanInfoIsOpen = ref(false);
const loanInfoEditIsOpen = ref(false);
const viewLoandetailIsOpen = ref(false);
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

</script>