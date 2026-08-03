import type { PaymentStatus } from "./enum_payment";
import { LoanInformationPaymentType } from "../loan/loan_list/enum_loan_lnformation";
import type { GetLoanInformationResponeDTO } from "../loan/loan_list/get_loan_list.dto";

export interface GetPaymentTableDTO {
  payId: string;
  payNumber: number;
  payPaymentRequiredDate: string;
  payPayDate?: string;
  payTotalPayment: number;
  payBeginningBalance: number;
  payPrincipal: number;
  payInterest: number;
  payRemainingBalance: number;
  payStatus: PaymentStatus;
  loanInformation?: {
    id?: string;
    paymentType?: LoanInformationPaymentType | string;
    [key: string]: any;
  };
  payCustomerName: string
  payCustomerImage: string
  paymentType?: LoanInformationPaymentType | string;
  payLoanNumber: string

}

export interface GetPaymentTableResponeDTO {
  id: string;
  paymentRequiredDate: string;
  totalPaymentNo: number;
  payDate?: string;
  totalPayment: number;
  beginningBalance: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: PaymentStatus;
  loanInformation?: GetLoanInformationResponeDTO
  paymentType?: LoanInformationPaymentType | string;
}

export const mapperPaymentTable = (
  data: GetPaymentTableResponeDTO,
): GetPaymentTableDTO => {
  return {
    payId: data.id,
    payNumber: data.totalPaymentNo,
    payPaymentRequiredDate: data.paymentRequiredDate,
    payPayDate: data.payDate,
    payTotalPayment: data.totalPayment,
    payBeginningBalance: data.beginningBalance,
    payPrincipal: data.principal,
    payInterest: data.interest,
    payRemainingBalance: data.remainingBalance,
    payStatus: data.status,
    loanInformation: data.loanInformation,
    payCustomerImage: data.loanInformation?.customer?.image ?? "",
    payCustomerName: data.loanInformation?.customer?.customerName ?? "",
    paymentType: data.paymentType || data.loanInformation?.paymentType,
    payLoanNumber: data.loanInformation?.loanNumber || "NA",
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
