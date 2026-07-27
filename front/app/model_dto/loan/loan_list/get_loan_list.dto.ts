import type { GetCurrentUserDTO } from "~/model_dto/auth/get_current_user.dto";
import type {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from "./enum_loan_lnformation";
import type {
  GetCustomerDTO,
  GetCustomerResponseDTO,
} from "~/model_dto/customer/getCustomer.dto";
import type { GetLoanTypeResponseDTO } from "../loan_type/get_loan_type.dto";

export interface GetLoanInformationResponeDTO {
  id: string;
  amount: number;
  purposeOfLoan: string;
  loanFee: number;
  penaltyRate: number;
  startDate: string;
  endDate: string;
  status: LoanInformationStatus;
  paymentType: LoanInformationPaymentType;
  customer: GetCustomerResponseDTO;
  loanType: GetLoanTypeResponseDTO;
}
export interface GetLoanInformationDTO {
  loanInfoId: string;
  loanInfoAmount: number;
  loanInfoPurposeOfLoan: string;
  loanInfoLoanFee: number;
  loanInfoPenaltyRate: number;
  loanInfoStartDate: string;
  loanInfoEndDate: string;
  loanInfoStatus: LoanInformationStatus;
  loanInfoPaymentType: LoanInformationPaymentType;
  loanInfoLoaner: string;
  loanInfoTypeName: string;
  loanInfoTypeDay?: number;
}

export const mapperLoanInformation = (
  data: GetLoanInformationResponeDTO,
): GetLoanInformationDTO => {
  return {
    loanInfoId: data.id,
    loanInfoAmount: data.amount,
    loanInfoPurposeOfLoan: data.purposeOfLoan,
    loanInfoLoanFee: data.loanFee,
    loanInfoPenaltyRate: data.penaltyRate,
    loanInfoStartDate: data.startDate,
    loanInfoEndDate: data.endDate,
    loanInfoStatus: data.status,
    loanInfoPaymentType: data.paymentType,
    loanInfoLoaner: data.customer.customerName,
    loanInfoTypeName: data.loanType.frequency,
    loanInfoTypeDay: data.loanType.frequency_day,
  };
};

const loanInfomationResponse = ref<GetLoanInformationResponeDTO[]>([]);

// Automatically updates whenever loanInfomationResponse changes
export const loanInfomationData = computed<GetLoanInformationDTO[]>(() =>
  loanInfomationResponse.value.map(mapperLoanInformation),
);
export async function getLoanInformationService(): Promise<void> {
  // Store raw API data directly without mapping here
  try {
    const res: any = await apiFetch("GET", "loan_information");
    loanInfomationResponse.value = res.data;
  } catch (error) {
    console.error("Error fetching loan type data:", error);
  }
}

export async function deleteLoanInformationService(id: string): Promise<void> {
  try {
    await apiFetch("DELETE", `loan_information/${id}`);
    await getLoanInformationService();
  } catch (error) {
    console.error("Error deleting loan information record:", error);
  }
}
