import {
  mapperProduct,
  type ProductDataResponse,
  type ProductDTO,
} from "~/model_dto/product.dto";
import {
  getWishListProductServer,
  toggleWishListProductServer,
} from "~~/server/wish_listServer";
export const wishListLoading = ref(false);
export const wishListMessage = ref<string | null>();
const wishListRes = ref<ProductDataResponse[] | []>([]);
export async function getWishListProductService(
  token: string,
  accLang?: string,
) {
  try {
    wishListLoading.value = true;
    const res: any = await getWishListProductServer("", token, accLang);
    wishListRes.value = res.data.data;
    return wishListRes.value;
  } catch (error: any) {
    wishListLoading.value = true;
    console.log("fatch product is wish list error ");
    // alert(error.data.message.product_id)
  } finally {
    wishListLoading.value = false;
  }
}
export async function toggleWishListProductService(
  prouductId: number,
  token: string,
  accLang?: string,
) {
  const payload = {
    product_id: prouductId,
  };
  const { showTaost } = useToastAlert();
  try {
    wishListLoading.value = true;
    const res = await toggleWishListProductServer(payload, token, accLang);
    const status = res.action;
    return status;
  } catch (error: any) {
    // alert(error.data.message.product_id)
    wishListLoading.value = true;
  } finally {
    wishListLoading.value = false;
    await getWishListProductService(token, accLang);
  }
}

export const wishListData = computed(() =>
  wishListRes.value.map(mapperProduct),
);
