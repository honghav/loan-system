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
          {{ $t('payment.title') }}
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {{ $t('payment.subtitle') }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- View Switcher Toggle -->
        <div
          class="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
        >
          <button
            @click="currentView = 'kanban'"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
              currentView === 'kanban'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            ]"
          >
            <span class="i-lucide-layout-grid w-4 h-4" />
            Kanban Board
          </button>
          <button
            @click="currentView = 'table'"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
              currentView === 'table'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            ]"
          >
            <span class="i-lucide-table w-4 h-4" />
            Table View
          </button>
        </div>

        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search amount or date..."
          class="w-full md:w-64"
          size="md"
        />
      </div>
    </div>

    <!-- KPI Summary Metrics Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2"
      >
        <div
          class="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider"
        >
          <span>Total Schedules</span>
          <span class="i-lucide-receipt w-5 h-5 text-primary-500" />
        </div>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-bold text-neutral-900 dark:text-white">
            {{ paymentTableData.length }}
          </span>
          <span class="text-xs text-neutral-400">Total Items</span>
        </div>
      </div>

      <div
        class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2"
      >
        <div
          class="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider"
        >
          <span>Total Receivable</span>
          <span class="i-lucide-dollar-sign w-5 h-5 text-blue-500" />
        </div>
        <div class="flex items-baseline justify-between">
          <span
            class="text-2xl font-bold font-mono text-neutral-900 dark:text-white"
          >
            {{ formatCurrency(totalReceivable) }}
          </span>
        </div>
      </div>

      <div
        class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2"
      >
        <div
          class="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider"
        >
          <span>Collected (Paid)</span>
          <span class="i-lucide-check-circle-2 w-5 h-5 text-emerald-500" />
        </div>
        <div class="flex items-baseline justify-between">
          <span
            class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400"
          >
            {{ formatCurrency(totalCollected) }}
          </span>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
          >
            {{ paidCount }} Paid
          </span>
        </div>
      </div>

      <div
        class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2"
      >
        <div
          class="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider"
        >
          <span>Pending / Outstanding</span>
          <span class="i-lucide-clock w-5 h-5 text-amber-500" />
        </div>
        <div class="flex items-baseline justify-between">
          <span
            class="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400"
          >
            {{ formatCurrency(totalOutstanding) }}
          </span>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
          >
            {{ pendingCount }} Outstanding
          </span>
        </div>
      </div>
    </div>

    <!-- KANBAN BOARD VIEW -->
    <div v-if="currentView === 'kanban'" class="space-y-4">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start"
      >
        <!-- Loop over columns defined by PaymentStatus -->
        <div
          v-for="col in kanbanColumns"
          :key="col.status"
          @dragover.prevent="onDragOver($event, col.status)"
          @dragenter.prevent="onDragEnter(col.status)"
          @dragleave="onDragLeave(col.status)"
          @drop="onDrop($event, col.status)"
          :class="[
            'flex flex-col rounded-2xl transition-all duration-200 overflow-hidden shadow-sm min-h-[500px]',
            activeDropColumn === col.status
              ? 'bg-primary-50/40 dark:bg-primary-950/20 border-2 border-dashed border-primary-500 ring-4 ring-primary-500/10'
              : 'bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80',
          ]"
        >
          <!-- Column Header -->
          <div
            :class="[
              'p-4 border-t-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between',
              col.headerClass,
            ]"
          >
            <div class="flex items-center gap-2">
              <span :class="[col.icon, 'w-5 h-5', col.iconColor]" />
              <h3 class="font-bold text-sm text-neutral-900 dark:text-white">
                {{ $t(`status.${col.status.toLowerCase()}`) }}
              </h3>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-2.5 py-0.5 text-xs font-bold font-mono rounded-full border',
                  col.badgeClass,
                ]"
              >
                {{ getKanbanCards(col.status).length }}
              </span>
            </div>
          </div>

          <!-- Column Header Summary (Total amount in column) -->
          <div
            class="px-4 py-2 bg-white/50 dark:bg-neutral-850/50 border-b border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono text-neutral-500 flex justify-between"
          >
            <span>Column Total:</span>
            <span class="font-semibold text-neutral-900 dark:text-white">
              {{ formatCurrency(getColumnTotal(col.status)) }}
            </span>
          </div>

          <!-- Column Cards Container -->
          <div
            class="p-3 space-y-3 flex-1 overflow-y-auto max-h-[650px] scrollbar-thin"
          >
            <!-- Kanban Card (Draggable) -->
            <div
              v-for="payment in getKanbanCards(col.status)"
              :key="payment.payId"
              draggable="true"
              @dragstart="onDragStart($event, payment)"
              @dragend="onDragEnd"
              :class="[
                'group relative p-4 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-600 cursor-grab active:cursor-grabbing transition-all duration-200 space-y-3 select-none',
                draggedPayment?.payId === payment.payId
                  ? 'opacity-40 scale-95 border-dashed border-primary-500'
                  : '',
              ]"
            >
              <!-- Card Top Bar: Date & Drag Handle & Dropdown Menu -->
              <div class="flex items-center justify-between text-xs">
                <div
                  class="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium"
                >
                <img :src="getImagePath (payment.payCustomerImage)" alt="" class="h-10 w-10 rounded-full">
                 {{ payment.payNumber }} - Due: {{ formatDate(payment.payPaymentRequiredDate) }}
                </div>
                <UDropdownMenu :items="getItemsPayment(payment)">
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    class="hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  />
                </UDropdownMenu>
              </div>

              <!-- Main Amount -->
              <div class="space-y-0.5">
                <span
                  class="text-xs text-neutral-400 uppercase tracking-wider font-medium"
                  >Total Required</span
                >
                <p
                  class="text-xl font-extrabold font-mono text-neutral-900 dark:text-white"
                >
                  {{ formatCurrency(payment.payTotalPayment) }}
                </p>
              </div>

              <!-- Breakdown Grid -->
              <div
                class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800/60 font-mono"
              >
                <div>
                  <span class="text-[10px] text-neutral-400 block"
                    >Principal</span
                  >
                  <span
                    class="font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    {{ formatCurrency(payment.payPrincipal) }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-neutral-400 block"
                    >Interest</span
                  >
                  <span
                    class="font-semibold text-amber-600 dark:text-amber-400"
                  >
                    {{ formatCurrency(payment.payInterest) }}
                  </span>
                </div>
              </div>

              <!-- Remaining Balance & Pay Date -->
              <div
                class="flex items-center justify-between text-xs font-mono pt-1"
              >
                <span class="text-neutral-400">Remaining:</span>
                <span class="font-bold text-neutral-800 dark:text-neutral-200">
                  {{ formatCurrency(payment.payRemainingBalance) }}
                </span>
              </div>

              <div
                v-if="payment.payPayDate"
                class="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border-t border-neutral-100 dark:border-neutral-800 pt-2"
              >
                <span class="i-lucide-check-circle-2 w-3.5 h-3.5" />
                Paid on: {{ formatDate(payment.payPayDate) }}
              </div>

              <!-- Quick Status Transition Buttons on Card -->
              <div
                class="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-1"
              >
                <span class="text-[10px] text-neutral-400 font-medium"
                  >Move:</span
                >
                <div class="flex items-center gap-1">
                  <button
                    v-if="payment.payStatus !== PaymentStatus.PAID"
                    @click="handleStatusUpdate(payment, PaymentStatus.PAID)"
                    title="Mark as Paid"
                    class="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1"
                  >
                    <span class="i-lucide-check w-3 h-3" /> Paid
                  </button>

                  <button
                    v-if="payment.payStatus !== PaymentStatus.PENDING"
                    @click="
                      handleStatusUpdate(payment, PaymentStatus.PENDING)
                    "
                    title="Mark as Pending"
                    class="px-2 py-1 text-[11px] font-semibold rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-colors flex items-center gap-1"
                  >
                    <span class="i-lucide-clock w-3 h-3" /> Pending
                  </button>

                  <button
                    v-if="payment.payStatus !== PaymentStatus.OVERDUE"
                    @click="
                      handleStatusUpdate(payment, PaymentStatus.OVERDUE)
                    "
                    title="Mark as Overdue"
                    class="px-2 py-1 text-[11px] font-semibold rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1"
                  >
                    <span class="i-lucide-alert-triangle w-3 h-3" /> Overdue
                  </button>

                  <button
                    v-if="payment.payStatus !== PaymentStatus.CANCELLED"
                    @click="
                      handleStatusUpdate(payment, PaymentStatus.CANCELLED)
                    "
                    title="Mark as Cancelled"
                    class="px-2 py-1 text-[11px] font-semibold rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty Column State -->
            <div
              v-if="getKanbanCards(col.status).length === 0"
              class="py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-xl flex flex-col items-center justify-center text-center p-4"
            >
              <span
                :class="[col.icon, 'w-8 h-8 opacity-30 mb-2', col.iconColor]"
              />
              <p class="text-xs font-semibold text-neutral-400">
                No {{ col.title }}
              </p>
              <p class="text-[11px] text-neutral-400 mt-1">
                Drag cards here to update status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE LIST VIEW (KEPT INTACT) -->
    <div v-else class="space-y-4">
      <!-- Status Tabs Filter for Table -->
      <div
        class="flex border-b border-neutral-200 dark:border-neutral-800 gap-1 overflow-x-auto"
      >
        <button
          v-for="status in statusTabs"
          :key="status.value"
          @click="selectedStatusFilter = status.value"
          :class="[
            'px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none flex items-center gap-2 whitespace-nowrap',
            selectedStatusFilter === status.value
              ? 'border-primary text-primary dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300',
          ]"
        >
          {{ status.label }}
          <span
            :class="[
              'px-2 py-0.5 text-xs rounded-full font-mono',
              selectedStatusFilter === status.value
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
            ]"
          >
            {{ getStatusCount(status.value) }}
          </span>
        </button>
      </div>

      <!-- Repayment Schedule Table -->
      <div
        class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full min-w-max table-auto text-left border-collapse">
            <thead>
              <tr
                class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                <th class="px-4 py-3.5 text-center w-16">{{ $t('common.actions') }}</th>
                <th class="px-4 py-3.5 text-center w-12">#</th>
                <th class="px-4 py-3.5 text-center w-12">{{ $t('customer.profile_image') }}</th>
                <th class="px-4 py-3.5 text-center w-12">{{ $t('loan.loan_number') }}</th>
                <th class="px-4 py-3.5">{{ $t('payment.required_date') }}</th>
                <th class="px-4 py-3.5">{{ $t('payment.pay_date') }}</th>
                <th class="px-4 py-3.5 text-right">{{ $t('payment.total_payment') }}</th>
                <th class="px-4 py-3.5 text-right">{{ $t('payment.beginning_balance') }}</th>
                <th class="px-4 py-3.5 text-right">{{ $t('payment.principal') }}</th>
                <th class="px-4 py-3.5 text-right">{{ $t('payment.interest') }}</th>
                <th class="px-4 py-3.5 text-right">{{ $t('payment.remaining_balance') }}</th>
                <th class="px-4 py-3.5 text-center">{{ $t('common.status') }}</th>
              </tr>
            </thead>
            <tbody
              class="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm"
            >
              <tr
                v-for="(payment, index) in filteredPaymentData"
                :key="payment.payId || index"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-150 text-neutral-700 dark:text-neutral-300"
              >
                <td class="px-4 py-3.5 text-center">
                  <UDropdownMenu :items="getItemsPayment(payment)">
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
                  class="px-4 py-3.5 text-center font-mono text-xs text-neutral-400"
                >
                  {{ payment.payNumber }}
                </td>
         
                <td
                  class="px-4 py-3.5 text-center font-mono text-xs text-neutral-400"
                >
                  <img :src="getImagePath (payment.payCustomerImage)" alt="" class="h-10 w-10 rounded-full">
                </td>
                <td class="px-4 py-3.5 font-medium text-xs">
                  {{ formatDate(payment.payPaymentRequiredDate) }}
                </td>
                       <td
                  class="px-4 py-3.5 text-center font-mono text-xs text-neutral-400"
                >
                  {{ payment.payLoanNumber }}
                </td>
                <td
                  class="px-4 py-3.5 font-medium text-xs text-emerald-600 dark:text-emerald-400"
                >
                  {{
                    payment.payPayDate ? formatDate(payment.payPayDate) : "-"
                  }}
                </td>
                <td
                  class="px-4 py-3.5 text-right font-mono font-semibold text-neutral-900 dark:text-white"
                >
                  {{ formatCurrency(payment.payTotalPayment) }}
                </td>
                <td
                  class="px-4 py-3.5 text-right font-mono text-neutral-600 dark:text-neutral-400"
                >
                  {{ formatCurrency(payment.payBeginningBalance) }}
                </td>
                <td
                  class="px-4 py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  {{ formatCurrency(payment.payPrincipal) }}
                </td>
                <td
                  class="px-4 py-3.5 text-right font-mono text-amber-600 dark:text-amber-400 font-medium"
                >
                  {{ formatCurrency(payment.payInterest) }}
                </td>
                <td
                  class="px-4 py-3.5 text-right font-mono font-semibold text-neutral-900 dark:text-white"
                >
                  {{ formatCurrency(payment.payRemainingBalance) }}
                </td>
                <td class="px-4 py-3.5 text-center">
                  <span
                    :class="[
                      'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider',
                      getPaymentStatusBadge(payment.payStatus),
                    ]"
                  >
                    {{ $t(`status.${(payment.payStatus || 'PENDING').toLowerCase()}`) }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredPaymentData.length === 0">
                <td
                  colspan="10"
                  class="px-6 py-12 text-center text-neutral-400 dark:text-neutral-500"
                >
                  <div
                    class="flex flex-col items-center justify-center space-y-3"
                  >
                    <span
                      class="i-lucide-calendar-x w-12 h-12 text-neutral-300 dark:text-neutral-700"
                    />
                    <p
                      class="text-base font-medium text-neutral-500 dark:text-neutral-400"
                    >
                      No payment schedules found
                    </p>
                    <p class="text-xs text-neutral-400">
                      Try adjusting your search query or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getPaymentTableService,
  paymentTableData,
  type GetPaymentTableDTO,
} from "~/model_dto/payment/get_payment.dto";
import { updateStatusPaymentService } from "~/model_dto/payment/update_payment";
import { PaymentStatus } from "~/model_dto/payment/enum_payment";
import { LoanInformationPaymentType } from "~/model_dto/loan/loan_list/enum_loan_lnformation";

const currentView = ref<"kanban" | "table">("table");
const searchQuery = ref("");
const selectedStatusFilter = ref("ALL");

// Drag and Drop state
const draggedPayment = ref<GetPaymentTableDTO | null>(null);
const activeDropColumn = ref<PaymentStatus | null>(null);

async function handleStatusUpdate(
  payment: GetPaymentTableDTO,
  targetStatus: PaymentStatus,
) {
  let amount: number | undefined = undefined;

  const paymentType =
    payment.paymentType || payment.loanInformation?.paymentType;

  if (
    targetStatus === PaymentStatus.PAID &&
    paymentType !== LoanInformationPaymentType.COMPLETED_PAYMENT &&
    paymentType !== "completed_payment"
  ) {
    const initialVal = payment.payInterest || 0;

    const { value: inputAmount, isConfirmed } = await Swal.fire({
      title: "Enter Payment Amount",
      text: "Please fill in the payment amount (leave empty or 0 to use Total Amount - Interest):",
      input: "number",
      inputAttributes: {
        step: "any",
        min: "0",
      },
      inputValue: initialVal.toString(),
      inputPlaceholder: `Default: ${initialVal}`,
      showCancelButton: true,
      confirmButtonText: "Confirm Payment",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton:
          "bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl mx-1",
        cancelButton:
          "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold px-4 py-2 rounded-xl mx-1",
        input:
          "border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-center text-lg font-mono",
      },
      buttonsStyling: false,
    });

    if (!isConfirmed) {
      return; // User cancelled prompt
    }

    const trimmed = (inputAmount || "").trim();
    const parsedAmount = Number(trimmed);

    if (trimmed === "" || parsedAmount === 0 || isNaN(parsedAmount)) {
      amount = initialVal;
    } else if (parsedAmount > 0) {
      amount = parsedAmount;
    } else {
      await Swal.fire({
        title: "Invalid Amount",
        text: "Please enter a valid positive payment amount.",
        icon: "error",
      });
      return;
    }
  }

  await updateStatusPaymentService(
    { payStatus: targetStatus, payAmount: amount },
    payment.payId,
  );
}

function onDragStart(event: DragEvent, payment: GetPaymentTableDTO) {
  draggedPayment.value = payment;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", payment.payId);
  }
}

function onDragEnd() {
  draggedPayment.value = null;
  activeDropColumn.value = null;
}

function onDragOver(event: DragEvent, status: PaymentStatus) {
  activeDropColumn.value = status;
}

function onDragEnter(status: PaymentStatus) {
  activeDropColumn.value = status;
}

function onDragLeave(status: PaymentStatus) {
  if (activeDropColumn.value === status) {
    activeDropColumn.value = null;
  }
}

async function onDrop(event: DragEvent, targetStatus: PaymentStatus) {
  event.preventDefault();
  activeDropColumn.value = null;

  if (!draggedPayment.value) return;

  const payment = draggedPayment.value;
  draggedPayment.value = null;

  if (payment.payStatus?.toUpperCase() !== targetStatus.toUpperCase()) {
    await handleStatusUpdate(payment, targetStatus);
  }
}

const kanbanColumns = [
  {
    status: PaymentStatus.PENDING,
    title: "Pending",
    headerClass: "bg-amber-50/60 dark:bg-amber-950/20 border-t-amber-500",
    badgeClass:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    icon: "i-lucide-clock",
    iconColor: "text-amber-500",
  },
  {
    status: PaymentStatus.PAID,
    title: "Paid / Settled",
    headerClass: "bg-emerald-50/60 dark:bg-emerald-950/20 border-t-emerald-500",
    badgeClass:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    icon: "i-lucide-check-circle-2",
    iconColor: "text-emerald-500",
  },
  {
    status: PaymentStatus.OVERDUE,
    title: "Overdue",
    headerClass: "bg-rose-50/60 dark:bg-rose-950/20 border-t-rose-500",
    badgeClass:
      "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    icon: "i-lucide-alert-triangle",
    iconColor: "text-rose-500",
  },
  {
    status: PaymentStatus.CANCELLED,
    title: "Cancelled",
    headerClass:
      "bg-neutral-100/60 dark:bg-neutral-800/40 border-t-neutral-400",
    badgeClass:
      "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700",
    icon: "i-lucide-ban",
    iconColor: "text-neutral-400",
  },
];

const statusTabs = [
  { label: "All Schedules", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Cancelled", value: "CANCELLED" },
];

function getKanbanCards(status: PaymentStatus) {
  let list = paymentTableData.value.filter(
    (p) => p.payStatus?.toUpperCase() === status.toUpperCase(),
  );

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((p) => {
      return (
        p.payPaymentRequiredDate?.toLowerCase().includes(q) ||
        p.payStatus?.toLowerCase().includes(q) ||
        String(p.payTotalPayment).includes(q) ||
        String(p.payPrincipal).includes(q) ||
        String(p.payInterest).includes(q)
      );
    });
  }

  return list;
}

function getColumnTotal(status: PaymentStatus): number {
  return getKanbanCards(status).reduce(
    (acc, item) => acc + (item.payTotalPayment || 0),
    0,
  );
}

const filteredPaymentData = computed(() => {
  let list = paymentTableData.value;

  if (selectedStatusFilter.value !== "ALL") {
    list = list.filter(
      (p) =>
        p.payStatus?.toUpperCase() === selectedStatusFilter.value.toUpperCase(),
    );
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((p) => {
      return (
        p.payPaymentRequiredDate?.toLowerCase().includes(q) ||
        p.payStatus?.toLowerCase().includes(q) ||
        String(p.payTotalPayment).includes(q) ||
        String(p.payPrincipal).includes(q) ||
        String(p.payInterest).includes(q)
      );
    });
  }

  const statusPriority: Record<string, number> = {
    PENDING: 1,
    OVERDUE: 2,
    PAID: 3,
    CANCELLED: 4,
  };

  return [...list].sort((a, b) => {
    const statusA = (a.payStatus || "PENDING").toUpperCase();
    const statusB = (b.payStatus || "PENDING").toUpperCase();

    const priorityA = statusPriority[statusA] ?? 99;
    const priorityB = statusPriority[statusB] ?? 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return (a.payNumber || 0) - (b.payNumber || 0);
  });
});

const totalReceivable = computed(() =>
  paymentTableData.value.reduce(
    (acc, item) => acc + (item.payTotalPayment || 0),
    0,
  ),
);

const totalCollected = computed(() =>
  paymentTableData.value
    .filter(
      (item) =>
        item.payStatus?.toUpperCase() === "PAID" ||
        item.payStatus?.toUpperCase() === "COMPLETED",
    )
    .reduce((acc, item) => acc + (item.payTotalPayment || 0), 0),
);

const totalOutstanding = computed(() =>
  paymentTableData.value
    .filter(
      (item) =>
        item.payStatus?.toUpperCase() !== "PAID" &&
        item.payStatus?.toUpperCase() !== "COMPLETED",
    )
    .reduce((acc, item) => acc + (item.payTotalPayment || 0), 0),
);

const paidCount = computed(
  () =>
    paymentTableData.value.filter(
      (item) =>
        item.payStatus?.toUpperCase() === "PAID" ||
        item.payStatus?.toUpperCase() === "COMPLETED",
    ).length,
);

const pendingCount = computed(
  () =>
    paymentTableData.value.filter(
      (item) =>
        item.payStatus?.toUpperCase() !== "PAID" &&
        item.payStatus?.toUpperCase() !== "COMPLETED",
    ).length,
);

function getStatusCount(status: string): number {
  if (status === "ALL") return paymentTableData.value.length;
  return paymentTableData.value.filter(
    (item) => item.payStatus?.toUpperCase() === status.toUpperCase(),
  ).length;
}

const getItemsPayment = (payment: GetPaymentTableDTO) => [
  [
    {
      label: "Mark as Paid",
      icon: "i-lucide-check-circle-2",
      onSelect: async () => {
        await handleStatusUpdate(payment, PaymentStatus.PAID);
      },
    },
    {
      label: "Mark as Pending",
      icon: "i-lucide-clock",
      onSelect: async () => {
        await handleStatusUpdate(payment, PaymentStatus.PENDING);
      },
    },
    {
      label: "Mark as Overdue",
      icon: "i-lucide-alert-triangle",
      color: "warning" as const,
      onSelect: async () => {
        await handleStatusUpdate(payment, PaymentStatus.OVERDUE);
      },
    },
    {
      label: "Mark as Cancelled",
      icon: "i-lucide-ban",
      color: "error" as const,
      onSelect: async () => {
        await handleStatusUpdate(payment, PaymentStatus.CANCELLED);
      },
    },
  ],
];

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

function getPaymentStatusBadge(status?: string) {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "COMPLETED":
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "PENDING":
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "OVERDUE":
      return "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    case "CANCELLED":
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 line-through opacity-75";
    default:
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
  }
}

onMounted(async () => {
  await getPaymentTableService();
});
</script>
