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

    <!-- Full-width Section: Proof Documents / Images Upload -->
    <div
      class="space-y-4 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800"
    >
      <div
        class="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
      >
        <div class="flex items-center gap-2">
          <span class="i-lucide-image-plus w-4 h-4" />
          Proof Documents / Images
        </div>
        <span
          v-if="proofList.length > 0"
          class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold"
        >
          {{ proofList.length }} {{ proofList.length === 1 ? 'file' : 'files' }} attached
        </span>
      </div>

      <!-- Drag & Drop Upload Zone -->
      <div
        class="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 bg-white/50 dark:bg-neutral-900/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/20"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="onFilesSelected"
        />

        <div class="flex flex-col items-center text-center space-y-2">
          <div
            class="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-xs"
          >
            <span v-if="!isUploading" class="i-lucide-upload-cloud w-6 h-6" />
            <span v-else class="i-lucide-loader-2 w-6 h-6 animate-spin" />
          </div>
          <div>
            <p class="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              <span class="text-primary-600 dark:text-primary-400 underline">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              PNG, JPG, JPEG, WEBP or GIF (Select multiple images)
            </p>
          </div>
        </div>
      </div>

      <!-- Preview Image Grid -->
      <div v-if="proofList.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
        <div
          v-for="(item, idx) in proofList"
          :key="idx"
          class="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:shadow-md transition-all"
        >
          <!-- Thumbnail preview -->
          <div class="h-24 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
            <img
              :src="getImagePath(item.path)"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <!-- File label -->
          <div class="p-2 flex items-center justify-between gap-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 truncate">
            <span class="truncate" :title="item.name">{{ item.name }}</span>
          </div>

          <!-- Delete overlay button -->
          <button
            type="button"
            class="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-xs transition-opacity shadow-xs focus:outline-none"
            title="Remove image"
            @click.stop="removeProof(idx)"
          >
            <span class="i-lucide-x w-3.5 h-3.5" />
          </button>
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
        :loading="isUploading"
        class="px-6"
      >
        {{ loanInfoEditIsOpen ? $t('common.save') : $t('loan.create_loan') }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import getToken from '~/constants/helper/getToken';
import getImagePath from '~/composables/getImagePath';
import { currentUserData } from '~/model_dto/auth/get_current_user.dto';
import { customerData } from '~/model_dto/customer/getCustomer.dto';
import {
  createLoanInformationService,
  type CreateLoanInformationDTO,
} from '~/model_dto/loan/loan_list/create_loan_list.dto';
import {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from '~/model_dto/loan/loan_list/enum_loan_lnformation';
import { getLoanInformationService } from '~/model_dto/loan/loan_list/get_loan_list.dto';
import { loanTypeData } from '~/model_dto/loan/loan_type/get_loan_type.dto';
import type { CreateProofDTO } from '~/model_dto/loan/loan_list/proof_loan.dto';

const token = ref(getToken());
const config = useRuntimeConfig();

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
  proofs: [],
});

const formLoanInfoIsOpen = ref(false);
const loanInfoEditIsOpen = ref(false);
const viewLoandetailIsOpen = ref(false);

// Multi-image upload reactive state
const proofList = ref<CreateProofDTO[]>([]);
const isUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function onFilesSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = Array.from(target.files);
  isUploading.value = true;

  try {
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res: any = await $fetch(
          `${config.public.apiUrl}/v1/customers/upload?folder=proofs`,
          {
            method: 'POST',
            body: formData,
            headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
          },
        );

        const uploadedUrl = res?.fileUrl || res?.fileKey || '';
        proofList.value.push({
          name: file.name,
          path: uploadedUrl || (await readFileAsDataURL(file)),
        });
      } catch (err) {
        // Fallback to data URL if upload endpoint fails or is offline
        const dataUrl = await readFileAsDataURL(file);
        proofList.value.push({
          name: file.name,
          path: dataUrl,
        });
      }
    }
    stateCreateLoanInfor.proofs = [...proofList.value];
  } finally {
    isUploading.value = false;
    if (target) target.value = '';
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

function removeProof(index: number) {
  proofList.value.splice(index, 1);
  stateCreateLoanInfor.proofs = [...proofList.value];
}

const emit = defineEmits(['close']);

async function onSubmitLoanInfo() {
  try {
    if (currentUserData.value?.Id) {
      stateCreateLoanInfor.loanInfoUserId = currentUserData.value.Id;
    }
    stateCreateLoanInfor.proofs = [...proofList.value];
    await createLoanInformationService(stateCreateLoanInfor);
    await getLoanInformationService(token.value as string);
    formLoanInfoIsOpen.value = false;
    proofList.value = [];
    emit('close');
  } catch (error) {
    console.error("Error creating loan information:", error);
  }
}
</script>