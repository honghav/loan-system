import {
  mapperAddress,
  type AddressCreateRequestDTO,
  type AddressDTO,
  type AddressResponseDTO,
  type AddressUpdateRequestDTO,
  type updateAndRemoveAddressRequestDTO,
} from "~/model_dto/address.dto";
import {
  createAddressServer,
  getAddressServer,
  getDefaultAddressServer,
  removeAddressServer,
  updateAddressServer,
  updateStatusAddressServer,
} from "~~/server/addressServer";
const addressRes = ref<AddressResponseDTO[]>([]);
const addressDefaultRes = ref<AddressResponseDTO | null>(null);
export const loadingAddress = ref(false);
export async function createAddressService(
  payload: AddressCreateRequestDTO,
  token: string,
  accLang: string,
) {
  const { showTaost } = useToastAlert();

  try {
    loadingAddress.value = true;
    return await createAddressServer(payload, token, accLang);
  } catch (error: any) {
    loadingAddress.value = true;
    showTaost(`${error.data?.message}`, "i-lucide-map-pin", 3000, "error");
    console.error("Error creating address:", error);
  } finally {
    loadingAddress.value = false;
  }
}
export async function updateAddressService(
  payload: AddressUpdateRequestDTO,
  token: string,
) {
  try {
    loadingAddress.value = true;
    return await updateAddressServer(payload, token);
  } catch (error) {
    loadingAddress.value = true;
    console.error("Error updating address:", error);
  } finally {
    loadingAddress.value = false;
  }
}
export async function removeAddressService(
  payload: updateAndRemoveAddressRequestDTO,
  token: string,
) {
  try {
    loadingAddress.value = true;
    return await removeAddressServer(payload, token);
  } catch (error) {
    loadingAddress.value = true;
    console.error("Error removing address:", error);
  } finally {
    loadingAddress.value = false;

    await getAddressService(token);
  }
}
// const { t } = useI18n();
export async function updateStatusAddressService(
  payload: updateAndRemoveAddressRequestDTO,
  token: string,
) {
  try {
    loadingAddress.value = true;

    return await updateStatusAddressServer(payload, token);
  } catch (error) {
    loadingAddress.value = true;

    console.error("Error updating address status:", error);
  } finally {
    loadingAddress.value = false;

    await getAddressService(token);
  }
}
export async function getAddressService(token: string) {
  try {
    const res = await getAddressServer(token);
    addressRes.value = res.data;
    return addressRes.value;
  } catch (error) {
    console.error("Error getting address:", error);
  }
}
export async function getDefaultAddressService(token: string) {
  try {
    const res = await getDefaultAddressServer(token);
    addressDefaultRes.value = res.data;
    // console.log("Address Defaule:", addressDefaultRes.value);
    return addressDefaultRes.value;
  } catch (error) {
    console.error("Error getting address:", error);
  }
}

export const addressData = computed(() =>
  addressRes.value.map(mapperAddress).sort((a, b) => b.id - a.id),
);
export const addressDefaultData = computed(() =>
  mapperAddress(addressDefaultRes.value as AddressResponseDTO),
);
// 2. FIXED: This now tracks dependencies. Whenever addressData updates, this automatically re-runs!
export const addressOption = computed(() => {
  // 1. Guard against missing data safely
  if (!addressData.value) return [];

  return addressData.value.map((item) => {
    // 2. Safely grab and capitalize the specific address item's type
    const typeStr = item.type || "";
    const addressType = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);

    return {
      label: `${addressType}: ${item.address}`,
      value: item.id,
      name: item.name,
      phone: item.phone,
      note: item.note,
      default: item.default_status,
    };
  });
});
// export const addressList: AddressDTO[] = addressData.map(mapperAddress);
