import {
  mapperGeneralInformation,
  mapperPromotion,
  mapperSocialDTO,
  type generalInfomationResponeDTO,
  type PromotionResponseDTO,
  type socailDTO,
  type socailResponeDTO,
} from "~/model_dto/other.dto";
import { getBusinessServer, getPromotionServer } from "~~/server/otherServer";
const promotionRes = ref<PromotionResponseDTO[]>([]);
const generalInformationRes = ref<generalInfomationResponeDTO | null>(null);
const socailRes = ref<socailResponeDTO[]>([]);
export async function getPromotionService(acceptLang?: string) {
  try {
    const response = await getPromotionServer(acceptLang);
    promotionRes.value = response.data.data;
    return promotionRes.value.map(mapperPromotion);
  } catch (error) {
    console.error("Error fetching promotion data:", error);
    throw error;
  }
}
export async function getBusinessService(acceptLang?: string) {
  try {
    const response = await getBusinessServer(acceptLang);
    generalInformationRes.value = response.data;
    socailRes.value = response.data.social;

    // console.log("Business Footer", generalInformationRes.value);
    return [generalInformationRes.value, socailRes.value];
  } catch (error) {
    console.error("Error fetching promotion data:", error);
    throw error;
  }
}
// 2. Safe computed properties (Only maps if data actually exists)
export const generalInforData = computed(() => {
  if (!generalInformationRes.value) return null;
  return mapperGeneralInformation(generalInformationRes.value);
});

export const socailData = computed(() => {
  if (!socailRes.value.length) return [];
  return socailRes.value.map(mapperSocialDTO);
});
export const promotionList = computed(() => promotionRes.value);
