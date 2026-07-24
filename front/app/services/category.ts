import { mapperCategoryDTO, type CategoryAPIResponse, type CategoryDataResponse, type CategroyDTO, type CatelogPayload } from "~/model_dto/category.dto";
import { categoryData } from "~/model_dto/data/data";
import {brandService, categoryService} from "~~/server/categoryService";
export const categoryRes =  ref<CategoryDataResponse[]>([]);
export const brandRes =  ref<CategoryDataResponse[]>([]);
export const countBrands = ref<boolean| null>(null)
export const countCategories = ref<boolean| null>(null)
export const itemLoading = ref(false)
export const categoryPagination = ref({
    current_page: 1,
    last_page: 1,
    total: 4,
});
export const brandPagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
});
export const payloadCategory: CatelogPayload = {
    page: 1,
    table_size: 16,
}


export async function getCategories(payload: CatelogPayload, locale?: string) {
    // Simulate an API call with a delay
    try {
        const res: any = await categoryService(payload, locale);
        categoryRes.value = res.data.data;
        return categoryRes;
    } catch (error) {
        console.error("Error fetching category data:", error);
    }
}

// export async function getCategoriesPaginated(page = 1, append = false, locale?: string) {
//     try {
//         const res: any = await categoryService({
//             ...payloadCategory,
//             page,
//         }, locale);
//         const categories = res?.data?.data ?? [];
//         const pagination = res?.data?.pagination;

//         categoryRes.value = append ? [...categoryRes.value, ...categories] : categories;

//         if (pagination) {
//             categoryPagination.value = {
//                 current_page: pagination.current_page,
//                 last_page: pagination.last_page,
//                 total: pagination.total,
//             };
//         }

//         return categoryRes;
//     } catch (error) {
//         console.error("Error fetching paginated category data:", error);
//         return categoryRes;
//     }
// }
export async function getCategoriesPaginated(
    page = 1,
    append = false,
    locale?: string
) {
    try {
        itemLoading.value = true
        const res: any = await categoryService(
            {
                ...payloadCategory,
                page,
            },
            locale
        );

        const categories = res?.data?.data ?? [];
        const pagination = res?.data?.pagination;

        categoryRes.value = append ? [...categoryRes.value, ...categories] : categories;

        if (pagination) {
            categoryPagination.value = {
                current_page: pagination.current_page,
                last_page: pagination.last_page,
                total: pagination.total,
            };
        

            // Check if next page exists
            countCategories.value =
                pagination.current_page < pagination.last_page;
            
        }
        console.log(countCategories.value)

        return categoryRes.value;
    } catch (error) {
        itemLoading.value = true
        console.error("Error fetching paginated brand data:", error);
        return categoryRes.value = categoryData;;
    }finally{
        itemLoading.value = false
    }
}


export async function getBrands(payload: CatelogPayload, locale?: string) {
    // Simulate an API call with a delay
    try {
        const res: any = await brandService(payload, locale);
        brandRes.value = res.data.data;
        // console.log("Brand Response:", brandRes.value);
        return brandRes;
    } catch (error) {
        console.error("Error fetching brand data:", error);
    }
}

export async function getBrandsPaginated(
    page = 1,
    append = false,
    locale?: string
) {
    try {
        const res: any = await brandService(
            {
                ...payloadCategory,
                page,
            },
            locale
        );

        const brands = res?.data?.data ?? [];
        const pagination = res?.data?.pagination;

        brandRes.value = append
            ? [...brandRes.value, ...brands]
            : brands;

        if (pagination) {
            brandPagination.value = {
                current_page: pagination.current_page,
                last_page: pagination.last_page,
                total: pagination.total,
            };

            // Check if next page exists
            countBrands.value =
                pagination.current_page < pagination.last_page;
        }
        console.log(countBrands.value)

        return brandRes.value;
    } catch (error) {
        console.error("Error fetching paginated brand data:", error);
        return brandRes.value = categoryData;
    }
}

export const categoryStatic =  categoryData;
export const categoryList = computed(() =>
  categoryRes.value.map(mapperCategoryDTO) 
);
export const brandList = computed(() =>
  brandRes.value.map(mapperCategoryDTO) 
);