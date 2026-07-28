import { getPaymentTableService } from "./get_payment.dto";
import { PaymentStatus } from "./enum_payment";

export interface UpdatePaymentStatusDTO {
  payStatus: PaymentStatus | string;
  payAmount?: number;
}

export interface UpdatePaymentStatusRequestDTO {
  status: string;
  amount?: number;
}

export const mapperUpdateStatusPayment = (
  data: UpdatePaymentStatusDTO,
): UpdatePaymentStatusRequestDTO => {
  return {
    status: data.payStatus,
    amount: data.payAmount,
  };
};

export async function updateStatusPaymentService(
  requestData: UpdatePaymentStatusDTO,
  id: string,
): Promise<void> {
  try {
    await apiFetch(
      "PATCH",
      `payment_table/${id}/status`,
      mapperUpdateStatusPayment(requestData),
    );
  } catch (error) {
    console.error("Error Update Payment Status:", error);
  } finally {
    await getPaymentTableService();
  }
}

