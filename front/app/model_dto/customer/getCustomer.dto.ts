export interface GetCustomerDTO {
  cusId: string;
  cusName: string;
  cusPhone: string;
  cusTelegramUsername?: string;
  cusCitizenId?: string;
  cusImage?: string;
  cusTelegram?: string;
  cusTelegramChatId?: string;
}

export interface GetCustomerResponseDTO {
  id: string;
  customerName: string;
  phoneNumber: string;
  telegramLinked?: string;
  citizenId?: string;
  image?: string;
  telegramUsername?: string;
  telegramChatId?: string;
}

export const mapperCustomer = (
  data: GetCustomerResponseDTO,
): GetCustomerDTO => ({
  cusId: data.id,
  cusName: data.customerName,
  cusPhone: data.phoneNumber,
  cusTelegramUsername: data.telegramUsername,
  cusCitizenId: data.citizenId,
  cusImage: data.image,
  cusTelegram: data.telegramLinked,
  cusTelegramChatId: data.telegramChatId,
});

// Holds RAW API Response
const customerResponse = ref<GetCustomerResponseDTO[]>([]);
const customerByIdResponse = ref<GetCustomerResponseDTO | null>(null);

// Automatically updates whenever customerResponse changes
export const customerData = computed<GetCustomerDTO[]>(() =>
  customerResponse.value.map(mapperCustomer),
);
export const customerByIdData = computed<GetCustomerDTO | null>(() => {
  if (!customerByIdResponse.value) return null;
  return mapperCustomer(customerByIdResponse.value);
});

export async function getCustomerService(): Promise<void> {
  // Store raw API data directly without mapping here
  try {
    const res: any = await apiFetch("GET", "customers");
    customerResponse.value = res;
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }
}
export async function getByIdCustomerService(id: string): Promise<void> {
  // Store raw API data directly without mapping here
  try {
    const res: any = await apiFetch("GET", `customers/${id}`);
    customerByIdResponse.value = res;
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }
  // customerByIdResponse.value = mockCustomerData.find((customer) => customer.id === id) || null;
}
