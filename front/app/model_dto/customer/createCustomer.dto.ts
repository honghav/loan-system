import { getCustomerService } from "./getCustomer.dto";

interface createCustomerRequestDTO {
  customerName: string;
  phoneNumber?: string;
  citizenId?: string;
  image?: string;
  telegramUsername?: string;
  telegramLinked?: string;
  telegramChatId?: string;
  userId?: string;
}

export interface createCustomerDTO {
cusName: string;
  cusPhone: string;
  cusTelegramUsername?: string;
  cusCitizenId?: string;
  cusImage?: string;
  cusTelegram?: string;
  cusTelegramChatId?: string;
  userId?: string;
}

export const mapperCreateCustomer = (data: createCustomerDTO ):createCustomerRequestDTO  => ({
  customerName: data.cusName,
  phoneNumber: data.cusPhone,
    telegramUsername: data.cusTelegramUsername,
    citizenId: data.cusCitizenId,
    image: data.cusImage,
    telegramLinked: data.cusTelegram,
    telegramChatId: data.cusTelegramChatId,
    userId: data.userId,
});

export async function createCustomerService(requestData: createCustomerDTO): Promise<void> {

    try {
        await apiFetch("POST", "customers", mapperCreateCustomer(requestData));
    } catch (error) {
        console.error("Error creating customer:", error);
    }finally {
        await getCustomerService();
    }
}
