<template>
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
        :label="$t('loan.payment_frequency')"
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
        :label="$t('loan.repayment_cycle_day')"
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
        :label="$t('loan.description')"
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
        :label="$t('common.cancel')"
        color="neutral"
        variant="ghost"
        @click="closeModal"
      />
      <UButton
        type="submit"
        color="primary"
        icon="i-lucide-check"
        class="px-4"
      >
        {{ loanTypeEditIsOpen ? $t('common.save') : $t('loan.create_loan_type') }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted } from "vue";
import getToken from "~/constants/helper/getToken";
import { currentUserData } from "~/model_dto/auth/get_current_user.dto";
import {
  createLoanTypeService,
  updateLoanTypeService,
  type CreateLoanTypeDTO,
} from "~/model_dto/loan/loan_type/create_loan_type.dto";
import { getLoanTypeService, type GetLoanTypeDTO } from "~/model_dto/loan/loan_type/get_loan_type.dto";

const emit = defineEmits(["close", "submit"]);
const token = ref(getToken());

const props = withDefaults(
  defineProps<{
    loanTypeEditIsOpen?: boolean;
    editingLoanType?: GetLoanTypeDTO | null;
  }>(),
  {
    loanTypeEditIsOpen: false,
    editingLoanType: null,
  }
);

const stateCreateLoanType = reactive<CreateLoanTypeDTO>({
  loanTypeFrequency: "",
  loanTypeFrequencyDay: 0,
  loanTypeDescription: "",
  loanTypeUserId: "",
});

function populateForm() {
  if (props.loanTypeEditIsOpen && props.editingLoanType) {
    stateCreateLoanType.loanTypeFrequency = props.editingLoanType.loanTypeFrequency || "";
    stateCreateLoanType.loanTypeFrequencyDay = props.editingLoanType.loanTypeFrequencyDay || 0;
    stateCreateLoanType.loanTypeDescription = props.editingLoanType.loanTypeDescription || "";
  } else {
    stateCreateLoanType.loanTypeFrequency = "";
    stateCreateLoanType.loanTypeFrequencyDay = 0;
    stateCreateLoanType.loanTypeDescription = "";
  }
}

onMounted(() => {
  populateForm();
});

watch(
  () => props.editingLoanType,
  () => {
    populateForm();
  },
  { deep: true }
);

const closeModal = () => {
  emit("close");
};

async function onSubmitLoanType() {
  try {
    if (currentUserData.value?.Id) {
      stateCreateLoanType.loanTypeUserId = currentUserData.value.Id;
    }

    if (props.loanTypeEditIsOpen && props.editingLoanType?.loanTypeId) {
      await updateLoanTypeService(props.editingLoanType.loanTypeId, stateCreateLoanType, token.value as string);
    } else {
      await createLoanTypeService(stateCreateLoanType, token.value as string);
    }

    await getLoanTypeService(token.value as string);
    emit("close");
  } catch (error) {
    console.error("Error submitting loan type:", error);
  }
}
</script>