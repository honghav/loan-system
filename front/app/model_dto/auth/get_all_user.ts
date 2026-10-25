import { mapperGetCurrentUser, type GetCurrentUserDTO, type GetCurrentUserResponeDTO } from "./get_current_user.dto";

// Holds RAW API Response as an array of users
const listUserResponse = ref<GetCurrentUserResponeDTO[]>([]);

// Automatically maps and updates whenever listUserResponse changes
export const listUserData = computed<GetCurrentUserDTO[]>(() =>
    Array.isArray(listUserResponse.value)
        ? listUserResponse.value.map(mapperGetCurrentUser)
        : [],
);

export async function getListUserService(token?: string) {
    try {
        const config = useRuntimeConfig();
        const tokenKey = config.public.tokenKey;
        const authToken = useCookie(String(tokenKey)).value;
        const tokenToUse = token || authToken || undefined;

        const res: any = await apiFetch(
            "GET",
            "users",
            undefined,
            tokenToUse,
        );

        if (Array.isArray(res)) {
            listUserResponse.value = res;
        } else if (Array.isArray(res?.data)) {
            listUserResponse.value = res.data;
        } else if (Array.isArray(res?.data?.users)) {
            listUserResponse.value = res.data.users;
        } else {
            listUserResponse.value = [];
        }
    } catch (error) {
        console.error("Get All Users Error", error);
    }
}