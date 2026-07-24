import {
  AddToCartServer,
  checkStockServer,
  deleteCartServer,
  GetCartServer,
  UpdateQtyCartServer,
} from "~~/server/cartServer";
import {
  mapperCartDTO,
  type AddToCartPayload,
  type CartDTO,
  type CartResponseDTO,
  type CheckCartStockPayload,
  type CheckStockDTO,
  type DeleteCartPayload,
  type GetCartPayload,
  type UpdateQtyCartPayload,
} from "~/model_dto/cart.dto";
import { userProfile } from "./profile";
const cartResponse = ref<CartResponseDTO | null>(null);
export const cartLoading = ref(false);
export const refreshCart = ref(false);
const qtyItemRes = ref<CheckStockDTO | null>(null);
export function getCartPayload(): GetCartPayload {
  return {
    filter: {
      customer_id: Number(userProfile.value?.id),
    },
  };
}

export async function refreshCartService(token: string, accLang?: string) {
  return await getCartService(token, accLang);
}

export async function addToCartService(
  payload: AddToCartPayload,
  token: string,
  accLang: string,
) {
  try {
    cartLoading.value = true;
    return await AddToCartServer(payload, token, accLang);
  } catch (error) {
    cartLoading.value = true;
    console.error("Error adding to cart:", error);
    throw error;
  } finally {
    cartLoading.value = false;
  }
}
export async function getCartService(token: string, accLang?: string) {
  try {
    cartLoading.value = true;
    const response = await GetCartServer(token, accLang);
    cartResponse.value = response.data ?? null;
    // console.log('Cart payload:', payload)
  } catch (error) {
    cartLoading.value = false;
    console.error("Error fetching cart:", error);
    throw error;
  } finally {
    cartLoading.value = false;
  }
}

export async function updateQtyCartService(
  payload: UpdateQtyCartPayload,
  token: string,
  accLang: string,
) {
  try {
    const response = await UpdateQtyCartServer(payload, token, accLang);
    await refreshCartService(token, accLang);
    return response;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
}
export async function deleteCartService(
  payload: DeleteCartPayload,
  token: string,
  accLang: string,
) {
  try {
    await deleteCartServer(payload, token, accLang);
    await refreshCartService(token, accLang);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  } finally {
    refreshCart.value = false;
  }
}
export const stockError = ref<string | null>(null);
export async function checkStockService(
  payload: CheckCartStockPayload,
  token: string,
  accLang: string,
) {
  try {
    stockError.value = null;
    const res = await checkStockServer(payload, token, accLang);
    qtyItemRes.value = res.data;
  } catch (error: any) {
    stockError.value = error?.data?.message || "No Stock Here";
    // alert("fetch product stock error");
  }
}
export async function updateCartQuantity(
  qty: number,
  productId: number,
  unitTypeId: number,
  variantGroup: string,
  token: string,
  locale: string,
) {
  const payloadStock: CheckCartStockPayload = {
    product_id: productId,
    unit_type_id: unitTypeId,
    variant_group: variantGroup,
    qty,
  };

  await checkStockService(payloadStock, token, locale);

  // const payload: UpdateQtyCartPayload = {
  //   cart_id: cartId,
  //   action: 1,
  //   qty,
  // };

  // return await updateQtyCartService(payload, token, locale);
}
//=====================================================//
//return Data or value to page for display at interface//
//=====================================================//
export const cartList = computed(() => mapperCartDTO(cartResponse.value));
export const stockItem = computed(() => qtyItemRes.value);
