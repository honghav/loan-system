import { getCustomerService } from "./getCustomer.dto";

export async function deleteCustomerService(id: string): Promise<void> {
  // Store raw API data directly without mapping here
  try{
    const res:any = await apiFetch("DELETE", `customers/${id}`)
  }catch(error){
    console.error("Error deleting customer data:", error);}finally{
    await getCustomerService();
  }
}