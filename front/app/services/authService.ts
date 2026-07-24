import type {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginRequestDTO,
  MessageRespone,
  ProfileDTO,
  RegisterRequestDTO,
} from "~/model_dto/profile.dto";
// import { bannerService } from "~~/server/bannerService";
import {
  changePasswordUserServer,
  forgotPasswordUserServer,
  loginServer,
  logoutServer,
  registerServer,
} from "~~/server/authServer";
import { getProfile } from "./profile";
import { addOrUpdateFCMToken } from "./fcmTokenService";

const profileRes = ref<ProfileDTO | null>(null);
export const loginMessageRes = ref<number | null>(null);
export const logoutLoading = ref(false);
const messageChangePassword = ref<string | null>(null);
export const forgotPasswordLoading = ref(false);
export async function loginService(payload: LoginRequestDTO, accLang: string) {
  const { avatarTaost } = useToastAlert();

  try {
    logoutLoading.value = true;

    const res: any = await loginServer(payload, accLang);

    profileRes.value = res;

    if (!res?.data?.token) {
      throw new Error("Login token not found.");
    }

    const accessToken = res.data.token;

    // Save login token first
    storeTokenUserId(accessToken);

    // Load user profile
    await getProfile(accessToken, accLang);

    // Request notification permission and register FCM
    try {
      await addOrUpdateFCMToken(accessToken, accLang);
    } catch (err) {
      console.error("Failed to register FCM:", err);
      // Don't block login if notification registration fails
    }

    // Welcome toast
    avatarTaost(
      `Welcome Back: ${res.data.user.name}`,
      `Username: ${res.data.user.username}, Phone Number: ${res.data.user.phone}`,
      res.data.user.image,
      res.data.user.image_path,
    );

    return profileRes;
  } catch (error: any) {
    loginMessageRes.value =
      error?.data?.message || error?.response?.data?.message;

    console.error(error);

    throw error;
  } finally {
    logoutLoading.value = false;
  }
}

export async function registerService(
  payload: RegisterRequestDTO,
  accLang: string,
) {
  const { closeModal } = useAuthModal();

  const { avatarTaost, showTaost } = useToastAlert();

  try {
    logoutLoading.value = true;

    const res: any = await registerServer(payload, accLang);

    profileRes.value = res;

    const { token, user } = res.data;

    if (!token) {
      throw new Error(
        "Registration succeeded but no access token was returned.",
      );
    }

    // Save authentication token
    storeTokenUserId(token);

    // Load user profile
    await getProfile(token, accLang);

    // Register FCM (don't interrupt registration if it fails)
    try {
      await addOrUpdateFCMToken(token, accLang);
    } catch (error) {
      console.warn("Unable to register FCM token:", error);
    }

    // Success notification
    avatarTaost(
      user.username,
      `${res.message}, ${$t("phone_number")}: ${user.phone}`,
      user.image,
      user.image_path,
    );

    return profileRes.value;
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed.";

    showTaost(message, "i-lucide-user-lock", 3000, "warning");

    console.error("Register Error:", error);

    throw error;
  } finally {
    logoutLoading.value = false;
    closeModal();
  }
}
export async function logoutService(accLang: string) {
  const { getDeviceId } = useDeviceId();
  const { avatarTaost } = useToastAlert();
  const route = useRoute();

  const payloadLogout = {
    device_id: getDeviceId(),
  };
  // Simulate an API call with a delay
  try {
    logoutLoading.value = true;
    const authToken = useAuthToken();
    await logoutServer(payloadLogout, authToken.value as string, accLang);
    authToken.value = null;
    // console.log(route.path)
    if (route.path === "/profile") {
      navigateTo("/");
    }
  } catch (error) {
    logoutLoading.value = true;
    console.error("Error fetching profile data:", error);
  } finally {
    logoutLoading.value = false;
  }
}
export async function changePasswordService(
  payload: ChangePasswordDTO,
  accLang: string,
) {
  const { showTaost } = useToastAlert();
  const { $i18n } = useNuxtApp();
  const t = $i18n.t.bind($i18n);
  // Simulate an API call with a delay
  try {
    logoutLoading.value = true;
    const authToken = useAuthToken();
    await changePasswordUserServer(payload, authToken.value as string, accLang);
    showTaost(t("password_changed_successfully"), "i-lucide-user-lock", 3000);
  } catch (error: any) {
    showTaost(error?.data?.message || t("error") || "Error", "i-lucide-user-lock", 3000, "warning");
    console.error("Error fetching profile data:", error);
  } finally {
    logoutLoading.value = false;
  }
}
export async function forgotPasswordService(
  payload: ForgotPasswordDTO,
  accLang: string,
) {
  const { showTaost } = useToastAlert();
  const { $i18n } = useNuxtApp();
  const t = $i18n.t.bind($i18n);
  // Simulate an API call with a delay
  try {
    forgotPasswordLoading.value = true;
    await forgotPasswordUserServer(payload, accLang);
    showTaost(t("password_changed_successfully"), "i-lucide-user-lock", 3000);
  } catch (error: any) {
    showTaost(
      error?.data?.message || t("error") || "Error",
      "i-lucide-user-lock",
      3000,
      "warning",
    );
    console.error("Error fetching profile data:", error);
  } finally {
    forgotPasswordLoading.value = false;
  }
}
