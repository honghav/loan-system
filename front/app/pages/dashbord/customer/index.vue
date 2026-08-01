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
          Customer Directory
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage and view details of all your loan customers, contact channels,
          and system identities.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search customers..."
          class="w-full md:w-64"
          size="md"
        />
        <UButton
          label="Create Loan"
          icon="i-lucide-hand-coins"
          color="neutral"
          variant="outline"
          size="md"
          @click="openCreateLoanModal('')"
        />
        <UButton
          label="Add Customer"
          icon="i-lucide-plus"
          color="primary"
          size="md"
          @click="
            () => {
              formCustomerIsOpen = true;
              customerEdit = false;
            }
          "
        />
      </div>

    </div>

    <!-- Table Card Container -->
    <div
      class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-max table-auto text-left border-collapse">
          <thead>
            <tr
              class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              <th class="px-6 py-4 w-20 text-center">Action</th>
              <th class="px-6 py-4 w-24">Photo</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Phone Number</th>
              <th class="px-6 py-4">Telegram Username</th>
              <th class="px-6 py-4">Citizen ID</th>
              <th class="px-6 py-4">Loan Active</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr
              v-for="customer in filteredCustomerData"
              :key="customer.cusId"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-150 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <!-- Action -->
              <td class="px-6 py-4 text-center">
                <UDropdownMenu :items="getItems(customer)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  />
                </UDropdownMenu>
              </td>

              <!-- Photo -->
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img
                    v-if="
                      customer.cusImage &&
                      customer.cusImage.trim() !== '' &&
                      !customer.cusImage.includes('heart.png')
                    "
                    :src="getImagePath(customer.cusImage)"
                    alt="Customer Image"
                    class="w-10 h-10 object-cover rounded-full ring-2 ring-neutral-100 dark:ring-neutral-850 shadow-sm"
                  />
                  <div
                    v-else
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs tracking-wider shadow-sm ring-2 ring-neutral-100 dark:ring-neutral-850',
                      getAvatarBg(customer.cusName),
                    ]"
                  >
                    {{ getInitials(customer.cusName) }}
                  </div>
                </div>
              </td>

              <!-- Name -->
              <td
                class="px-6 py-4 font-semibold text-neutral-900 dark:text-white"
              >
                {{ customer.cusName }}
              </td>

              <!-- Phone -->
              <td class="px-6 py-4 font-mono text-xs">
                <div
                  class="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400"
                >
                  <span class="i-lucide-phone text-neutral-400 w-3.5 h-3.5" />
                  {{ customer.cusPhone || "—" }}
                </div>
              </td>

             

              <!-- Telegram Username -->
              <td class="px-6 py-4">
                <div
                  v-if="customer.cusTelegramUsername"
                  class="flex items-center gap-1"
                >
                  <span
                    class="text-xs text-neutral-600 dark:text-neutral-400 font-mono"
                  >
                    {{ customer.cusTelegramUsername }}
                  </span>
                </div>
                <span
                  v-else
                  class="text-xs text-neutral-400 dark:text-neutral-600"
                  >—</span
                >
              </td>

              <!-- Citizen ID -->
              <td
                class="px-6 py-4 font-mono text-xs text-neutral-600 dark:text-neutral-400"
              >
                <div
                  v-if="customer.cusCitizenId"
                  class="flex items-center gap-1.5"
                >
                  <span class="i-lucide-id-card text-neutral-400 w-3.5 h-3.5" />
                  {{ customer.cusCitizenId }}
                </div>
                <span
                  v-else
                  class="text-xs text-neutral-400 dark:text-neutral-600"
                  >—</span
                >
              </td>

               <!-- Active Loan -->
              <td class="px-6 py-4">
                <div
                  class="flex items-center justify-center gap-1.5"
                >
                  {{ customer.cusActiveLoansCount }}
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredCustomerData.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div
                  class="flex flex-col items-center justify-center space-y-3"
                >
                  <span
                    class="i-lucide-users text-neutral-300 dark:text-neutral-700 w-12 h-12"
                  />
                  <p
                    class="text-base font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    No customers found
                  </p>
                  <p class="text-xs text-neutral-400 dark:text-neutral-600">
                    Try refining your search query or add a new customer
                    database record.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- View Customer Modal -->
  <UModal
    :dismissible="true"
    v-model:open="viewCustomerIsOpen"
    title="Customer Details"
    :ui="{
      content:
        'sm:max-w-md overflow-hidden rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl',
    }"
  >
    <template #body>
      <div v-if="customerByIdData" class="space-y-6">
        <!-- Banner Profile Header -->
        <div class="relative pb-4">
          <div
            class="h-28 w-full bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 rounded-t-lg"
          ></div>
          <div class="absolute top-14 left-1/2 -translate-x-1/2">
            <img
              v-if="
                customerByIdData.cusImage &&
                customerByIdData.cusImage.trim() !== '' &&
                !customerByIdData.cusImage.includes('heart.png')
              "
              :src="getImagePath(customerByIdData.cusImage)"
              alt="Customer Image"
              class="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-neutral-900 shadow-md ring-1 ring-neutral-200/50"
            />
            <div
              v-else
              :class="[
                'w-24 h-24 rounded-full flex items-center justify-center font-semibold text-2xl tracking-wider shadow-md border-4 border-white dark:border-neutral-900 ring-1 ring-neutral-200/50',
                getAvatarBg(customerByIdData.cusName),
              ]"
            >
              {{ getInitials(customerByIdData.cusName) }}
            </div>
          </div>
        </div>

        <div class="text-center pt-2">
          <h3 class="text-xl font-bold text-neutral-900 dark:text-white">
            {{ customerByIdData.cusName }}
          </h3>
          <p
            class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium"
          >
            Customer Profile Identity
          </p>
        </div>

        <!-- Detail Fields Grid -->
        <div
          class="bg-neutral-50 dark:bg-neutral-800/40 rounded-xl p-4 space-y-4 border border-neutral-100 dark:border-neutral-850"
        >
          <!-- Phone Number -->
          <div
            class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                <span class="i-lucide-phone w-4 h-4 block" />
              </div>
              <div class="flex flex-col">
                <span
                  class="text-2xs uppercase tracking-wider text-neutral-400 font-semibold"
                  >Phone Number</span
                >
                <span
                  class="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200"
                  >{{ customerByIdData.cusPhone || "N/A" }}</span
                >
              </div>
            </div>
            <UButton
              v-if="customerByIdData.cusPhone"
              icon="i-lucide-copy"
              variant="ghost"
              color="neutral"
              size="xs"
              class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
              @click="copyText(customerByIdData.cusPhone, 'Phone number')"
            />
          </div>

          <!-- Citizen ID -->
          <div
            class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                <span class="i-lucide-id-card w-4 h-4 block" />
              </div>
              <div class="flex flex-col">
                <span
                  class="text-2xs uppercase tracking-wider text-neutral-400 font-semibold"
                  >Citizen ID / ID Card</span
                >
                <span
                  class="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200"
                  >{{ customerByIdData.cusCitizenId || "N/A" }}</span
                >
              </div>
            </div>
            <UButton
              v-if="customerByIdData.cusCitizenId"
              icon="i-lucide-copy"
              variant="ghost"
              color="neutral"
              size="xs"
              class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
              @click="copyText(customerByIdData.cusCitizenId, 'Citizen ID')"
            />
          </div>

          <!-- Telegram Username -->
          <div
            class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                <span class="i-lucide-user w-4 h-4 block" />
              </div>
              <div class="flex flex-col">
                <span
                  class="text-2xs uppercase tracking-wider text-neutral-400 font-semibold"
                  >Telegram Username</span
                >
                <span
                  class="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200"
                  >{{ customerByIdData.cusTelegramUsername || "N/A" }}</span
                >
              </div>
            </div>
            <UButton
              v-if="customerByIdData.cusTelegramUsername"
              icon="i-lucide-copy"
              variant="ghost"
              color="neutral"
              size="xs"
              class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
              @click="
                copyText(
                  customerByIdData.cusTelegramUsername,
                  'Telegram username',
                )
              "
            />
          </div>

          <!-- Telegram Chat -->
          <div class="flex items-center justify-between pb-1">
            <div class="flex items-center gap-3">
              <div
                class="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                <span class="i-lucide-send w-4 h-4 block" />
              </div>
              <div class="flex flex-col">
                <span
                  class="text-2xs uppercase tracking-wider text-neutral-400 font-semibold"
                  >Telegram Handle</span
                >
                <span
                  class="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                >
                  <a
                    v-if="customerByIdData.cusTelegram"
                    :href="`https://t.me/${customerByIdData.cusTelegram.replace('@', '')}`"
                    target="_blank"
                    class="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                  >
                    {{ customerByIdData.cusTelegram }}
                    <span class="i-lucide-external-link w-3.5 h-3.5" />
                  </a>
                  <span v-else>N/A</span>
                </span>
              </div>
            </div>
            <UButton
              v-if="customerByIdData.cusTelegram"
              icon="i-lucide-copy"
              variant="ghost"
              color="neutral"
              size="xs"
              class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
              @click="copyText(customerByIdData.cusTelegram, 'Telegram Link')"
            />
          </div>
        </div>

        <!-- Action Footer -->
        <div class="flex justify-end gap-2 pt-2">
          <UButton
            label="Close"
            color="neutral"
            variant="ghost"
            @click="viewCustomerIsOpen = false"
          />
          <UButton
            label="Edit Profile"
            icon="i-lucide-pencil"
            color="primary"
            @click="
              () => {
                viewCustomerIsOpen = false;
                formCustomerIsOpen = true;
                customerEdit = true;
              }
            "
          />
        </div>
      </div>
    </template>
  </UModal>

  <!-- Add/Edit Customer Modal -->
  <UModal
    :dismissible="true"
    v-model:open="formCustomerIsOpen"
    :title="customerEdit ? 'Edit Customer Information' : 'Add New Customer'"
    :ui="{
      content:
        'sm:max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl',
    }"
  >
    <template #body>
      <UForm :state="formState" class="space-y-5" @submit="onSubmit">
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Fill out the customer credentials below. Ensure phone number and
          citizen IDs are entered accurately.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Full Name -->
          <UFormField
            label="Full Name"
            name="cusName"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="formState.cusName"
              placeholder="e.g. John Doe"
              icon="i-lucide-user"
              class="w-full"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>

          <!-- Phone Number -->
          <UFormField
            label="Phone Number"
            name="cusPhone"
            required
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="formState.cusPhone"
              placeholder="e.g. +85512345678"
              icon="i-lucide-phone"
              class="w-full"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>

          <!-- Citizen ID -->
          <UFormField
            label="Citizen ID"
            name="cusCitizenId"
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="formState.cusCitizenId"
              placeholder="e.g. 120938493"
              icon="i-lucide-id-card"
              class="w-full"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>

          <!-- Telegram Username -->
          <UFormField
            label="Telegram Username"
            name="cusTelegramUsername"
            class="flex flex-col gap-1"
          >
            <UInput
              v-model="formState.cusTelegramUsername"
              placeholder="e.g. johndoe_tg"
              icon="i-lucide-send"
              class="w-full"
              :ui="{
                base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
              }"
            />
          </UFormField>

          <!-- Avatar Image Input / Upload (Base64) -->
          <UFormField
            label="Profile Image"
            name="cusImage"
            class="col-span-1 md:col-span-2 flex flex-col gap-1"
          >
            <div class="flex items-center gap-3">
              <!-- Small Preview -->
              <div class="shrink-0">
                <img
                  v-if="
                    formState.cusImage &&
                    formState.cusImage.trim() !== '' &&
                    !formState.cusImage.includes('heart.png')
                  "
                  :src="getImagePath(formState.cusImage)"
                  alt="Preview"
                  class="w-12 h-12 object-cover rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-700"
                >
                  <span class="i-lucide-image w-5 h-5" />
                </div>
              </div>

              <!-- URL Input & Upload Action -->
              <div class="flex-1 space-y-2">
                <!-- <UInput
                  v-model="formState.cusImage"
                  placeholder="Paste image URL or upload file below..."
                  icon="i-lucide-image"
                  class="w-full"
                  :ui="{
                    base: 'h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary',
                  }"
                /> -->
                <div class="flex flex-wrap items-center gap-2">
                  <label
                    class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    <span class="i-lucide-upload w-3.5 h-3.5" />
                    Upload File (Auto Base64)
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="onFileChange"
                    />
                  </label>
                  <UButton
                    v-if="formState.cusImage"
                    label="Clear Image"
                    color="error"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-trash"
                    @click="formState.cusImage = ''"
                  />
                </div>
              </div>
            </div>
          </UFormField>
        </div>

        <!-- Action Row -->
        <div
          class="flex flex-wrap justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800"
        >
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="formCustomerIsOpen = false"
          />
          <UButton
            v-if="!customerEdit"
            label="Register & Create Loan"
            color="neutral"
            variant="outline"
            icon="i-lucide-hand-coins"
            @click="onSubmit(true)"
          />
          <UButton
            type="submit"
            color="primary"
            icon="i-lucide-check"
            class="px-4"
          >
            {{ customerEdit ? "Save Changes" : "Register Customer" }}
          </UButton>
        </div>

      </UForm>
    </template>
  </UModal>

  <!-- Modal 2: Loan Information Form (Modern Horizontal Style) -->
  <UModal
    :dismissible="true"
    v-model:open="formLoanInfoIsOpen"
    :title="
      loanInfoEditIsOpen ? 'Edit Loan Record' : 'Create New Loan Record'
    "
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
          Configure borrower details, financial amounts, payment schedules, and terms in this modern horizontal layout.
        </p>

        <!-- Horizontal Multi-Column Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column: Borrower & Financial Details -->
          <div class="space-y-5 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
            <div class="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
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
                  {{ t.loanTypeFrequency }} - {{ t.loanTypeDescription }} ({{ t.loanTypeFrequencyDay }} days)
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
          <div class="space-y-5 p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
            <div class="flex items-center gap-2 pb-2 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-indigo-500">
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
                  <option value="installment_payment">Installment Payment</option>
                  <option value="completed_payment">Completed Payment</option>
                  <option value="fee_payment">Fee Payment</option>
                </select>
              </UFormField>
            </div>

            <!-- Dates Grid -->
            <div :class="[stateCreateLoanInfor.loanInfoPaymentType?.toLowerCase() === 'completed_payment' ? 'grid grid-cols-2 gap-3' : 'space-y-4']">
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
                  stateCreateLoanInfor.loanInfoPaymentType === 'completed_payment' ||
                  stateCreateLoanInfor.loanInfoPaymentType === 'COMPLETED_PAYMENT' ||
                  stateCreateLoanInfor.loanInfoPaymentType?.toLowerCase() === 'completed_payment'
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
            <UFormField
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
            </UFormField>
          </div>
        </div>

        <!-- Action Row -->
        <div class="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
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

</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import { currentUserData } from "~/model_dto/auth/get_current_user.dto";
import {
  createCustomerService,
  mapperCreateCustomer,
  type createCustomerDTO,
} from "~/model_dto/customer/createCustomer.dto";
import { deleteCustomerService } from "~/model_dto/customer/deleteCustomer.dto";
import {
  customerByIdData,
  customerData,
  getByIdCustomerService,
  getCustomerService,
} from "~/model_dto/customer/getCustomer.dto";
import { updateCustomerService } from "~/model_dto/customer/updateCustomer.dto";
import {
  createLoanInformationService,
  type CreateLoanInformationDTO,
} from "~/model_dto/loan/loan_list/create_loan_list.dto";
import {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from "~/model_dto/loan/loan_list/enum_loan_lnformation";
import { getLoanInformationService } from "~/model_dto/loan/loan_list/get_loan_list.dto";
import {
  getLoanTypeService,
  loanTypeData,
} from "~/model_dto/loan/loan_type/get_loan_type.dto";

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

function openCreateLoanModal(cusId?: string) {
  loanInfoEditIsOpen.value = false;
  stateCreateLoanInfor.loanInfoAmount = 0;
  stateCreateLoanInfor.loanInfoPurposeOfLoan = "";
  stateCreateLoanInfor.loanInfoLoanFee = 0;
  stateCreateLoanInfor.loanInfoPenaltyRate = 0;
  stateCreateLoanInfor.loanInfoStartDate = new Date().toISOString().split("T")[0];
  stateCreateLoanInfor.loanInfoEndDate = undefined;
  stateCreateLoanInfor.loanInfoStatus = LoanInformationStatus.IN_PAYMENT;
  stateCreateLoanInfor.loanInfoPaymentType = LoanInformationPaymentType.INSTALLMENT_PAYMENT;
  stateCreateLoanInfor.loanInfoLoanerId = cusId || (customerData.value[0]?.cusId || "");
  stateCreateLoanInfor.loanInfoTypeId = loanTypeData.value[0]?.loanTypeId || "";
  formLoanInfoIsOpen.value = true;
}

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

onMounted(async () => {
  await getCustomerService();
  await getLoanTypeService();
});

//=======================//
//handle Customer action //
//=======================//
const viewCustomerIsOpen = ref(false);
const formCustomerIsOpen = ref(false);
const customerEdit = ref(false);
const searchQuery = ref("");
const config = useRuntimeConfig();

// Filter customerData locally
const filteredCustomerData = computed(() => {
  if (!searchQuery.value) return customerData.value;
  const q = searchQuery.value.toLowerCase().trim();
  return customerData.value.filter(
    (c) =>
      c.cusName?.toLowerCase().includes(q) ||
      c.cusPhone?.toLowerCase().includes(q) ||
      c.cusCitizenId?.toLowerCase().includes(q) ||
      c.cusTelegramUsername?.toLowerCase().includes(q) ||
      c.cusTelegram?.toLowerCase().includes(q),
  );
});

// Dropdown Action items
const getItems = (customer: any) => [
  [
    {
      label: "Create Loan",
      icon: "i-lucide-hand-coins",
      onSelect: () => {
        openCreateLoanModal(customer.cusId);
      },
    },
    {
      label: "View Profile",
      icon: "i-lucide-eye",
      onSelect: async () => {
        viewCustomerIsOpen.value = true;
        await getByIdCustomerService(customer.cusId);
      },
    },
    {
      label: "Edit Profile",
      icon: "i-lucide-pencil",
      onSelect: async () => {
        formCustomerIsOpen.value = true;
        await getByIdCustomerService(customer.cusId);
        customerEdit.value = true;
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error" as const,
      onSelect: async () => {
        await deleteCustomerService(customer.cusId);
      },
    },
  ],
];

// Helper to get name initials for avatar fallback
function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Helper to assign stable background colors based on name
function getAvatarBg(name: string) {
  if (!name) return "bg-neutral-500 text-white";
  const colors = [
    "bg-red-500 text-white",
    "bg-orange-500 text-white",
    "bg-amber-500 text-white",
    "bg-emerald-500 text-white",
    "bg-teal-500 text-white",
    "bg-blue-500 text-white",
    "bg-indigo-500 text-white",
    "bg-violet-500 text-white",
    "bg-pink-500 text-white",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Copy to Clipboard utility
const toast = useToast();
function copyText(text: string, label: string) {
  if (!text) return;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.add({
        title: "Copied!",
        description: `${label} has been copied to your clipboard.`,
        color: "success",
      });
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

// Form state DTO mappings
const stateEdit = reactive<createCustomerDTO>({
  cusName: customerByIdData.value?.cusName || "",
  cusPhone: customerByIdData.value?.cusPhone || "",
  cusTelegram: customerByIdData.value?.cusTelegram || "",
  cusCitizenId: customerByIdData.value?.cusCitizenId || "",
  cusImage: customerByIdData.value?.cusImage || "",
  cusTelegramUsername: customerByIdData.value?.cusTelegramUsername || "",
  userId: currentUserData.value?.Id,
});

const stateCreate = reactive<createCustomerDTO>({
  cusName: "",
  cusPhone: "",
  cusTelegram: "",
  cusCitizenId: "",
  cusImage: "",
  cusTelegramUsername: "",
  userId: currentUserData.value?.Id,
});

const formState = computed(() =>
  customerEdit.value ? stateEdit : stateCreate,
);

// Watch single customer detail selection and bind to stateEdit for form fields update
watch(customerByIdData, (newVal) => {
  if (newVal && customerEdit.value) {
    stateEdit.cusName = newVal.cusName || "";
    stateEdit.cusPhone = newVal.cusPhone || "";
    stateEdit.cusTelegram = newVal.cusTelegram || "";
    stateEdit.cusCitizenId = newVal.cusCitizenId || "";
    stateEdit.cusImage = newVal.cusImage || "";
    stateEdit.cusTelegramUsername = newVal.cusTelegramUsername || "";
    stateEdit.cusTelegramChatId = newVal.cusTelegramChatId || "";
  }
});

// File change handler to convert local images into base64 strings
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // Validate size (limit to 2MB to avoid huge payload overheads)
  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      title: "File Too Large",
      description: "Please select an image smaller than 2MB.",
      color: "error",
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target?.result as string;
    formState.value.cusImage = base64String;
    toast.add({
      title: "Image Processed",
      description: "Image successfully encoded to Base64 format.",
      color: "success",
    });
  };
  reader.onerror = (error) => {
    console.error("Error reading file: ", error);
  };
  reader.readAsDataURL(file);
}

async function onSubmit(createLoanAfter: boolean = false) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });

  if (customerEdit.value) {
    await updateCustomerService(stateEdit, customerByIdData.value?.cusId || "");
  } else {
    await createCustomerService(stateCreate);
  }

  formCustomerIsOpen.value = false;

  if (createLoanAfter) {
    const newestCusId = customerData.value[0]?.cusId || "";
    openCreateLoanModal(newestCusId);
  }
}
</script>

