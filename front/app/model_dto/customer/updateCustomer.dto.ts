import { mapperCreateCustomer, type createCustomerDTO } from "./createCustomer.dto";
import { getCustomerService } from "./getCustomer.dto";

export async function updateCustomerService(requestData: createCustomerDTO, id: string): Promise<void> {

    try {
        await apiFetch("PATCH", `customers/${id}`, mapperCreateCustomer(requestData));
    } catch (error) {
        console.error("Error updating customer:", error);
    }finally {
        await getCustomerService();
    }
}