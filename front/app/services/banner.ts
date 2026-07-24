import { mapperBanner, type BannerDto, type BannerPayload, type BannerResponse } from "~/model_dto/banner.model";
import { bannerData } from "~/model_dto/data/data";
import { bannerService } from "~~/server/bannerService";

export const bannerResBanner =  ref<BannerResponse[]>([]);
export const bannerResSlideShow =  ref<BannerResponse[]>([]);
export const bannerLoading = ref(false)
export const payloadBanner: BannerPayload = {
    position: 1
}
export const payloadSlideShow: BannerPayload = {
    position: 2
}
export async function getBannerByScreenPosition(payload: BannerPayload) {
    // Simulate an API call with a delay
    try {
        bannerLoading.value = true
        const res: any = await bannerService(payload);
        bannerResBanner.value = res.data;
        return bannerResBanner.value.map(mapperBanner);
    } catch (error) {
        bannerLoading.value = true
        // bannerResBanner.value = bannerData 
        console.error("Error fetching banner data:", error);
    }finally {
        bannerLoading.value = false

    }
}
export async function getSlideShowByScreenPosition(payload: BannerPayload) {
    // Simulate an API call with a delay
    try {
        bannerLoading.value = true
        const res: any = await bannerService(payload);
        bannerResSlideShow.value = res.data;
        return bannerResSlideShow.value.map(mapperBanner);
    } catch (error) {
        bannerLoading.value = true
        console.error("Error fetching slide show data:", error);
    }finally{
        bannerLoading.value = false
    }
}
export const bannerRespnose = computed(() => bannerResBanner.value);
export const bannerPromotion: BannerDto[] = bannerData.filter(banner => banner.type === "Promotion" && banner.status === "Active")!;
export const bannerSub = computed(() => bannerResSlideShow.value);