import type {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from "./enum_loan_lnformation";

export interface CreateLoanInformationDTO {
  loanInfoAmount: number;
  loanInfoPurposeOfLoan: string;
  loanInfoLoanFee: number;
  loanInfoPenaltyRate: number;
  loanInfoStartDate: string;
  loanInfoEndDate?: string;
  loanInfoStatus: LoanInformationStatus;
  loanInfoPaymentType: LoanInformationPaymentType;
  loanInfoLoanerId: string;
  loanInfoTypeId: string;
  loanInfoUserId: string;
}
export interface CreateLoanInformationRequestDTO {
  amount: string;
  purposeOfLoan: string;
  loanFee: string;
  penaltyRate: string;
  startDate: string;
  endDate?: string;
  status: string;
  paymentType: string;
  userId: string;
  loanTypeId: string;
  customerId: string;
}

export const mapperCreateLoanInformation = (
  data: CreateLoanInformationDTO,
): CreateLoanInformationRequestDTO => {
  return {
    amount: data.loanInfoAmount.toString(),
    purposeOfLoan: data.loanInfoPurposeOfLoan || "",
    loanFee: data.loanInfoLoanFee.toString(),
    penaltyRate: data.loanInfoPenaltyRate.toString(),
    startDate: data.loanInfoStartDate,
    endDate: data.loanInfoEndDate,
    status: data.loanInfoStatus,
    paymentType: data.loanInfoPaymentType,
    userId: data.loanInfoUserId,
    loanTypeId: data.loanInfoTypeId,
    customerId: data.loanInfoLoanerId,
  };
};

export async function createLoanInformationService(
  data: CreateLoanInformationDTO,
) {
  try {
    const res = await apiFetch(
      "POST",
      "loan_information",
      mapperCreateLoanInformation(data),
    );
    return res;
  } catch (error) {
    console.error("Create Loan Information Error", error);
    throw error;
  }
}
