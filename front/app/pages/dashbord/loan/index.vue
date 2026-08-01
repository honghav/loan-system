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
              <th class="px-6 py-4 w-20 text-center">Action</th>
              <th class="px-6 py-4">Loan Number</th>
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
              <td class="px-6 py-4 font-mono">${{ loan.loanInfoLoanFee }}</td>
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
                  {{ loan.loanInfoStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs capitalize">
                {{ loan.loanInfoPaymentType }}
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
  <!-- Modal 2: Loan Information Form (Modern Horizontal Style) -->
  <UModal
    :dismissible="false"
    v-model:open="formLoanInfoIsOpen"
    :title="loanInfoEditIsOpen ? 'Edit Loan Record' : 'Create New Loan Record'"
    :ui="{
      content:
        'sm:max-w-4xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden',
    }"
  >
    <template #body>
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
              1. Borrower & Loan Amount
            </div>

            <!-- Customer Selection -->
            <UFormField
              label="Customer / Borrower"
              name="loanInfoLoanerId"
              required
              class="flex flex-col gap-1 text-xs"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoLoanerId"
                required
                class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-medium"
              >
                <option value="" disabled>Select Customer</option>
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
              label="Loan Configuration Type"
              name="loanInfoTypeId"
              required
              class="flex flex-col gap-1 text-xs"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoTypeId"
                required
                class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-medium"
              >
                <option value="" disabled>Select Loan Type</option>
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
                label="Principal Amount ($)"
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
                label="Loan Fee ($)"
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
              label="Purpose of Loan"
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
              2. Terms, Dates & Status
            </div>

            <!-- Penalty & Payment Type Grid -->
            <div class="grid grid-cols-2 gap-3">
              <UFormField
                label="Penalty Rate (%)"
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
                label="Payment Type"
                name="loanInfoPaymentType"
                required
                class="flex flex-col gap-1 text-xs"
              >
                <select
                  v-model="stateCreateLoanInfor.loanInfoPaymentType"
                  class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-medium"
                >
                  <option value="installment_payment">
                    Installment Payment
                  </option>
                  <option value="completed_payment">Completed Payment</option>
                  <option value="fee_payment">Fee Payment</option>
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
                label="Start Date"
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
                label="End Date"
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

            <!-- Status -->
            <!-- <UFormField
              label="Loan Status"
              name="loanInfoStatus"
              required
              class="flex flex-col gap-1 text-xs"
            >
              <select
                v-model="stateCreateLoanInfor.loanInfoStatus"
                class="w-full h-10 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-sm font-semibold"
              >
                <option value="in_payment">In Payment (Active)</option>
                <option value="completed">Completed</option>
              </select>
            </UFormField> -->
          </div>
        </div>

        <!-- Action Row -->
        <div
          class="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800"
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
            class="px-6"
          >
            {{ loanInfoEditIsOpen ? "Save Changes" : "Create Record" }}
          </UButton>
        </div>
      </UForm>
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
                  {{ formatCurrency(loanInfomationByIdData?.loanInfoLoanFee) }}
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
                          getPaymentStatusBadge(payment.payStatus),
                        ]"
                      >
                        {{ payment.payStatus || "PENDING" }}
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
            @click="viewLoandetailIsOpen = false"
          />
        </div>
      </div>
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
  loanInfomationByIdData,
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
const viewLoandetailIsOpen = ref(false);
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
      label: "View Loan Detail",
      icon: "i-lucide-eye",
      onSelect: async () => {
        if (!loanInfor?.loanInfoId) return;
        // Reset previous state to avoid flash of old data
        // loanInfomationByIdData.value = null;
        viewLoandetailIsOpen.value = true;
        await getLoanInformationByIdService(loanInfor.loanInfoId);
      },
    },
  ],
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

// ==================================//
// Formatters & UI Helpers           //
// ==================================//
function formatCurrency(val?: number): string {
  if (val === undefined || val === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(val);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getLoanStatusBadge(status?: string) {
  switch (status?.toLowerCase()) {
    case "completed":
    case "paid":
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "in_payment":
    case "in payment":
    case "active":
      return "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800";
    default:
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
  }
}

function getPaymentStatusBadge(status?: string) {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "COMPLETED":
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "PENDING":
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "OVERDUE":
      return "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    default:
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
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
