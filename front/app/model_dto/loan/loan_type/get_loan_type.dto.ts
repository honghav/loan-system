
export interface GetLoanTypeDTO {
  loanTypeId: string;
  loanTypeFrequency?: string;
  loanTypeFrequencyDay?: number;
  loanTypeDescription?: string;
  loanTypeUserId?: string;
}

export interface GetLoanTypeResponseDTO {
  id: string;
  frequency: string;
  loanTypeFrequency?: string;
  frequency_day?: number;
  description?: string;
  userId?: string;
}

export const mapperLoanType = (data: GetLoanTypeResponseDTO): GetLoanTypeDTO => ({
  loanTypeId: data.id,
    loanTypeFrequency: data.frequency,
    loanTypeFrequencyDay: data.frequency_day,
    loanTypeDescription: data.description,
    loanTypeUserId: data.userId,
});


const loanTypeResponse = ref<GetLoanTypeResponseDTO[]>([]);

// Automatically updates whenever loanTypeResponse changes
export const loanTypeData = computed<GetLoanTypeDTO[]>(() => 
  loanTypeResponse.value.map(mapperLoanType)
);
export async function getLoanTypeService(): Promise<void> {
  // Store raw API data directly without mapping here
  try{
    const res:any = await apiFetch("GET", "laon_type")
    loanTypeResponse.value = res;
  }catch(error){
    console.error("Error fetching loan type data:", error);
  }
}