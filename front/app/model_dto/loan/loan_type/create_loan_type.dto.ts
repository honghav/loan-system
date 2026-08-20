import { getLoanTypeService } from "./get_loan_type.dto";

export interface CreateLoanTypeDTO {
  loanTypeFrequency?: string;
  loanTypeFrequencyDay?: number;
  loanTypeDescription?: string;
  loanTypeUserId?: string;
}

export interface CreateLoanTypeResponseDTO {
  frequency: string;
  frequency_day?: string;
  description?: string;
  userId?: string;
}

export const mapperCreateLoanType = (data: CreateLoanTypeDTO): CreateLoanTypeResponseDTO => ({
  frequency: data.loanTypeFrequency || "",
  frequency_day: data.loanTypeFrequencyDay?.toString() || "",
  description: data.loanTypeDescription,
  userId: data.loanTypeUserId,
});

export const createLoanTypeService = async (requestData: CreateLoanTypeDTO): Promise<void> => {
  try {
    await apiFetch("POST", "laon_type", mapperCreateLoanType(requestData));
  } catch (error) {
    console.error("Error creating loan type:", error);
  } finally {
    await getLoanTypeService();
  }
};

export const updateLoanTypeService = async (id: string, requestData: CreateLoanTypeDTO): Promise<void> => {
  try {
    await apiFetch("PATCH", `laon_type/${id}`, mapperCreateLoanType(requestData));
  } catch (error) {
    console.error("Error updating loan type:", error);
  } finally {
    await getLoanTypeService();
  }
};

export const deleteLoanTypeService = async (id: string): Promise<void> => {
  try {
    await apiFetch("DELETE", `laon_type/${id}`);
  } catch (error) {
    console.error("Error deleting loan type:", error);
  } finally {
    await getLoanTypeService();
  }
};