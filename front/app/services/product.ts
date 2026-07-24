import {
  mapperProduct,
  type ProductDataResponse,
  type ProductDetailPayload,
  type ProductDTO,
  type ProductPayload,
} from "~/model_dto/product.dto";
import {
  productServer,
  productFilterServer,
  productDetailServer,
  productReletedServer,
} from "../../server/productService";
import { productData } from "~/model_dto/data/data";
import { userId } from "~/model_dto/profile.dto";
import { userProfile } from "./profile";
import { checkStockService } from "./cartService";
export const productRes = ref<ProductDataResponse[]>([]);
export const productResDis = ref<ProductDataResponse[]>([]);
export const productDetailRes = ref<ProductDataResponse | null>(null);
export const productBySkuRes = ref<ProductDataResponse | null>(null);
export const productDetailFilter = ref<ProductDataResponse[]>([]);
export const filterLoading = ref(false);
export const productDetailLoading = ref(false);
export const productLoading = ref(false);
export const payloadProduct: ProductPayload = {
  page: 1,
  table_size: 30,
};
export const payloadProductDiscount: ProductPayload = {
  page: 1,
  table_size: 10,
  //   filter: {
  //     has_promotion: 1,
  //   },
  sort: "sale_count",
};

export const payloadProductNew: ProductPayload = {
  page: 1,
  table_size: 10,
  sort: "newest",
};
// Product new
export async function getProductNew(
  page = 1,
  append = false,
  token?: string,
  locale?: string,
) {
  try {
    filterLoading.value = true;
    const res: any = await productServer(
      {
        ...payloadProductNew,
        page,
      },
      token,
      locale,
    );
    const productsNew = res?.data?.data ?? [];
    const pagination = res?.data?.pagination;

    // console.log("New products (raw):", productsNew);

    const mappedProducts = productsNew.map(mapperProduct);
    productNew.value = append
      ? [...productNew.value, ...mappedProducts]
      : mappedProducts;

    if (pagination) {
      productNewPagination.value = {
        current_page: pagination.current_page,
        last_page: pagination.last_page,
        total: pagination.total,
      };
    }

    return productNew.value;
  } catch (error) {
    filterLoading.value = true;
    console.error("Error fetching new products:", error);
    return (productNew.value = productData);
  } finally {
    filterLoading.value = false;
  }
}
// Get Product Filter
export async function getProductFilter(
  payload: ProductPayload,
  page = 1,
  append = false,
  token: string,
  locale: string,
) {
  try {
    filterLoading.value = true;
    const res: any = await productServer(
      {
        ...payload,
        page,
      },
      token,
      locale,
    );
    const productsFilter = res?.data?.data ?? productData;
    const pagination = res?.data?.pagination;

    const mappedProducts = productsFilter.map(mapperProduct);
    productFilter.value = append
      ? [...productFilter.value, ...mappedProducts]
      : mappedProducts;

    if (pagination) {
      productNewPagination.value = {
        current_page: pagination.current_page,
        last_page: pagination.last_page,
        total: pagination.total,
      };
    }

    return productFilter.value;
  } catch (error) {
    filterLoading.value = true;
    console.error("Error fetching filtered products:", error);
    return (productFilter.value = productData.slice(0, 8));
  } finally {
    filterLoading.value = false;
  }
}

// Product List
export async function getProducts(
  payload: ProductPayload,
  token?: string,
  locale?: string,
) {
  // Simulate an API call with a delay
  try {
    const res: any = await productServer(payload, token, locale);
    productRes.value = res.data.data;
    return productRes;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}
// Product Detail
export async function getProductSku(productSku?: string, accLang?: string) {
  const payloadProductSku: ProductPayload = {
    page: 1,
    table_size: 1,
    filter: {
      search: productSku,
    },
  };
  try {
    const res: any = await productServer(payloadProductSku, undefined, accLang);
    productBySkuRes.value = res.data.data;
    return productBySkuRes.value;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
  //  finally {
  //   productDetailLoading.value = false;
  // }
}
export async function getProductDetail(
  productId: number,
  token?: string,
  accLang?: string,
) {
  const payloadProductDetail: ProductDetailPayload = {
    filter: {
      product_id: productId,
      customer_id: userProfile.value?.id ?? 0,
    },
  };
  try {
    productDetailLoading.value = true;
    const res: any = await productDetailServer(
      payloadProductDetail,
      token,
      accLang,
    );
    productDetailRes.value = res.data.product;
    return mapperProduct(productDetailRes.value as ProductDataResponse);
  } catch (error) {
    productDetailLoading.value = true;
    console.error("Error fetching product data:", error);
    return null;
  } finally {
    productDetailLoading.value = false;
  }
}
export const productRelatedRes = ref<ProductDataResponse[]>([]);

export async function productReletedService(
  productId: number,
  token?: string,
  accLang?: string,
) {
  const payloadProductRelated: ProductDetailPayload = {
    filter: {
      product_id: productId,
      customer_id: userProfile.value?.id ?? undefined,
    },
  };

  try {
    productDetailLoading.value = true;
    const res: any = await productReletedServer(
      payloadProductRelated,
      token,
      accLang,
    );

    // Store raw API items directly
    productRelatedRes.value = res.data?.related_products ?? [];
    // console.log("Product Related loaded:", productRelatedRes.value);
    return productRelatedRes.value;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  } finally {
    productDetailLoading.value = false;
  }
}
// Filter by Category
// export async function getProductCategoryId(cate_id: number, locale?: string): Promise<ProductDTO[] | null> {
//    const payloadProductCategory: ProductPayload = {
//     page: 1,
//     table_size: 10,
//     filter: {
//         category_id: cate_id,
//     },
//     created_at: 1
// }
//     try {
//         const res: any = await productServer(payloadProductCategory, locale);
//         const products = res?.data?.data ?? [];
//         productRelatedRes.value = products.map(mapperProduct);
//         return productRelatedRes.value;
//     } catch (error) {
//         console.error("Error fetching product data:", error);
//         return null;
//     }
// }
export const productDiscount = ref<ProductDTO[]>([]);
export const productNew = ref<ProductDTO[]>([]);
export const productFilter = ref<ProductDTO[]>([]);
export const productNewPagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
});
// Product with discount
export async function getProductDiscount(token?: string, locale?: string) {
  try {
    productLoading.value = true;
    const productResDis = await productServer(
      payloadProductDiscount,
      token,
      locale,
    );
    productDiscount.value = productResDis.data.data.map(mapperProduct);
    console.log("Products with discount (raw):", productDiscount.value);
    return productDiscount.value;
  } catch (error) {
    productLoading.value = true;
    productDiscount.value = productData;
    console.error("Error get Product Discount products:", error);
    return [];
  } finally {
    productLoading.value = false;
  }
}

export async function productFilterService(
  payload: ProductPayload,
  locale?: string,
) {
  try {
    const res: any = await productFilterServer(payload, locale);
    const productDetailFilter = res.data.product;
    return productDetailFilter.map(mapperProduct);
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
}
export const productList = computed(() => productRes.value.map(mapperProduct));
export const productDiscountList = computed(() => productDiscount.value);
export const productNewList = computed(() => productNew.value);
export const productFilterList = computed(() => productFilter.value);
export const productDetailData = computed(() => productDetailRes.value);
export const productRelatedData = computed(() => productRelatedRes.value);
export const productBySkuData = computed(() =>
  mapperProduct(productBySkuRes.value as ProductDataResponse),
);
