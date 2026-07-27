import type { LoginType } from "./user_enum.dto";

export interface GetCurrentUserResponeDTO {
  id: string;
  name: string;
  username: string;
  phone: string;
  googleAccount: string;
  telegramChatId: string;
  telegramUsername: string;
  image: string;
  loginType: string;
  role: string;
  status: string;
}
export interface GetCurrentUserDTO {
  Id: string;
  Name: string;
  Username: string;
  Phone: string;
  GoogleAccount: string;
  TelegramChatId: string;
  TelegramUsername: string;
  Image: string;
  LoginType: string;
  Role: string;
  Status: string;
}

export const mapperGetCurrentUser = (
  data: GetCurrentUserResponeDTO,
): GetCurrentUserDTO => {
  return {
    Id: data.id,
    Name: data.name,
    Username: data.username,
    Phone: data.phone,
    GoogleAccount: data.googleAccount,
    TelegramChatId: data.telegramChatId,
    TelegramUsername: data.telegramUsername,
    Image: data.image,
    LoginType: data.loginType,
    Role: data.role,
    Status: data.status,
  };
};

// Holds RAW API Response
const currentUserResponse = ref<GetCurrentUserResponeDTO | null>(null);

// Automatically updates whenever currentUserResponse changes
export const currentUserData = computed<GetCurrentUserDTO | null>(() =>
  currentUserResponse.value ? mapperGetCurrentUser(currentUserResponse.value) : null,
);

export async function getCurrentUserService(token?: string) {
  try {
    const config = useRuntimeConfig();
    const tokenKey = config.public.tokenKey;
    const authToken = useCookie(String(tokenKey)).value;
    const tokenToUse = token || authToken || undefined;

    const res: any = await apiFetch(
      "GET",
      "auth/current-user",
      undefined,
      tokenToUse,
    );
    if (res?.data?.user) {
      currentUserResponse.value = res.data.user;
    }
  } catch (error) {
    console.error("Get Current User Error", error);
  }
}
