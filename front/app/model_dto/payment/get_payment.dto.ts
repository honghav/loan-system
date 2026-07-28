import type { PaymentStatus } from "./enum_payment";

export interface GetPaymentTableDTO {
  payId: string;
  payPaymentRequiredDate: string;
  payPayDate?: string;
  payTotalPayment: number;
  payBeginningBalance: number;
  payPrincipal: number;
  payInterest: number;
  payRemainingBalance: number;
  payStatus: PaymentStatus;
}

export interface GetPaymentTableResponeDTO {
  id: string;
  paymentRequiredDate: string;
  payDate?: string;
  totalPayment: number;
  beginningBalance: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: PaymentStatus;
}

export const mapperPaymentTable = (
  data: GetPaymentTableResponeDTO,
): GetPaymentTableDTO => {
  return {
    payId: data.id,
    payPaymentRequiredDate: data.paymentRequiredDate,
    payPayDate: data.payDate,
    payTotalPayment: data.totalPayment,
    payBeginningBalance: data.beginningBalance,
    payPrincipal: data.principal,
    payInterest: data.interest,
    payRemainingBalance: data.remainingBalance,
    payStatus: data.status,
  };
};

const paymentTableResponse = ref<GetPaymentTableResponeDTO[]>([]);

export const paymentTableData = computed<GetPaymentTableDTO[]>(() =>
  paymentTableResponse.value.map(mapperPaymentTable),
);

export async function getPaymentTableService(): Promise<void> {
  try {
    const res: any = await apiFetch("GET", "payment_table");
    paymentTableResponse.value = res.data;
  } catch (error) {
    console.error("Error fetching payment table data:", error);
  }
}

export async function updatePaymentStatusService(
  id: string,
  status: string,
): Promise<void> {
  try {
    await apiFetch("PATCH", `payment_table/${id}/status`, { status });
    await getPaymentTableService();
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
}
