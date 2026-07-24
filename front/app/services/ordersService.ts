import {
  type OrderHistoryResponseDTO,
  type OrderHistoryPayload,
  type ProccessOrderFromDTO,
  type ProccessOrderPayloadRequestDTO,
  mapperOrderHistory,
  type OrderDetailReqDTO,
  type OrderDetailResponseDTO,
  mapperOrderDetail,
  type FeedBackReqPayloadDTO,
  type DeleveryFeeDTO,
} from "~/model_dto/order.dto";
import type { ProfileDTO } from "~/model_dto/profile.dto";
import { cartList } from "./cartService";
import { paymentMethodList } from "~/constants/controller/layout/footer";
import { userProfile } from "./profile";
import {
  feedbackServer,
  getDetailOrderServer,
  getFeeDeliveryServer,
  getHistoryOrderServer,
  processOrderServer,
} from "~~/server/ordersServer";
import { addressData } from "./addressService";
import Swal from "sweetalert2";

const orderHistoryRes = ref<OrderHistoryResponseDTO[] | []>([]);
const orderDetailRes = ref<OrderDetailResponseDTO | null>(null);
export const paymentLoading = ref(false);
//=======================================//
//process order service
//=======================================//
export async function processOrderService(
  payload: ProccessOrderPayloadRequestDTO,
  token: string,
) {
  const { showTaost } = useToastAlert();
  const { $i18n } = useNuxtApp();
  const t = $i18n.t.bind($i18n);
  paymentLoading.value = true;

  try {
    const resOrder = await processOrderServer(payload, token);
    showTaost(
      t("order_placed_sucssfully"),
      "i-lucide-check-circle",
      3000,
      "success",
    );
    const loadingAlert = Swal.fire({
      title: t("processing_order"),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        container: "swal-container",
        popup: "rounded-2xl bg-secondary shadow-lg",
        title: "text-lg font-bold text-secondary",
        htmlContainer: "text-secondary",
      },
    });

    navigateTo("profile?tab=order");
    const title = `Order #${resOrder.data.order_id}`;
    const description = `We've received your order. You can track its status anytime. Payment: ${resOrder.data.payment_type} (${resOrder.data.payment_status}).`;
    const route = `/order/${resOrder.data.order_id}`;
    await sendNotification(title, description, route);
  } catch (error: any) {
    Swal.close();

    const errorMessage =
      error?.response?.data?.message || "order_process_error";

    Swal.fire({
      icon: "error",
      title: t("order_process_failed"),
      text: errorMessage,
      confirmButtonText: t("try_again"),
      confirmButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-2xl bg-secondary shadow-lg",
        title: "text-lg font-bold text-secondary",
        htmlContainer: "text-secondary",
        confirmButton: "rounded-lg px-6 py-2 font-semibold transition-all",
      },
    });

    console.error("Order processing error:", error);
  } finally {
    Swal.close();

    paymentLoading.value = false;
  }
}
//=======================================//
//get history order service
//=======================================//
export const paginationData = ref({
  total: 5,
  per_page: 5,
  current_page: 1,
  last_page: 1,
});

export async function getHistoryOrderService(
  payload: OrderHistoryPayload,
  token: string,
) {
  try {
    const res: any = await getHistoryOrderServer(payload, token);

    if (res?.data) {
      const listData = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : res.data.data?.data || [];
      orderHistoryRes.value = listData;

      if (res.data.pagination) {
        paginationData.value = res.data.pagination;
      } else if (res.data.data?.pagination) {
        paginationData.value = res.data.data.pagination;
      }
    }

    return res?.data;
  } catch (error: any) {
    console.error("Failed to load order history", error);
  }
}
//===============================//
//get order detail service
//===============================//
export async function getOrderDetailService(
  payload: OrderDetailReqDTO,
  token: string,
  accLang: string,
): Promise<OrderDetailResponseDTO | null> {
  try {
    const res = await getDetailOrderServer(payload, token, accLang);

    if (!res?.data) {
      console.warn("Order detail data is null", res);
      orderDetailRes.value = null;
      return null;
    }

    orderDetailRes.value = res.data as OrderDetailResponseDTO;

    return orderDetailRes.value;
  } catch (error: any) {
    console.error(
      "error Order detail",
      error?.response?.data || error?.message || error,
    );

    orderDetailRes.value = null;

    return null;
  }
}

//=============================//
// feedback service
//=============================//
export async function feedbackService(
  payload: FeedBackReqPayloadDTO,
  token: string,
  accLang: string,
) {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t.bind($i18n);
  const { showTaost } = useToastAlert();
  try {
    await feedbackServer(payload, token, accLang);
    showTaost(
      t("feedback_submitted_successfully"),
      "material-symbols:cards-star",
      3000,
      "success",
    );
  } catch (error: any) {
    console.error("Error leaving feedback:", error);
  }
}

//=========================================================//
// Get Delivery fee follow total price and shipping address//
//=========================================================//
const deliveryFeeRes = ref<string | null>(null);
export async function getFeeDeliveryService(
  payload: DeleveryFeeDTO,
  token: string,
  accLang: string,
) {
  try {
    const res = await getFeeDeliveryServer(payload, token, accLang);
    deliveryFeeRes.value = res.data.delivery_fee;
  } catch (error: any) {
    console.error("Error leaving feedback:", error);
  }
}

// Get delivery fee

export const deliveryFeeData = computed(() => deliveryFeeRes.value);

// data mapping
export const orderHistoryData = computed(() =>
  (orderHistoryRes.value || []).map(mapperOrderHistory),
);
// data of order detail
export const orderDetailData = computed(() => {
  if (!orderDetailRes.value) return null;

  return mapperOrderDetail(orderDetailRes.value);
});
