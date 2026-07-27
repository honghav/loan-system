import { LoginType, UserRole, UserStatus } from "./user_enum.dto";
// Register type
export interface RegisterRequestDTO {
  name: string;
  phone?: string;
  username?: string;
  googleAccount?: string;
  telegramUsername?: string;
  image?: string;
  password?: string;
  loginType: LoginType;
  role: UserRole;
  status?: UserStatus;
}
export interface RegisterDTO {
  regiName: string;
  regiPhone?: string;
  regiUsername?: string;
  regiGoogleAccount?: string;
  regiTelegramUsername?: string;
  regiImage?: string;
  regiPassword?: string;
  regiLoginType: LoginType;
  regiRole: UserRole;
  regiStatus?: UserStatus;
}
// Login Type
export interface LoginRequestDTO {
  username?: string;
  phone?: string;
  password?: string;
  loginType: LoginType;
}
export interface LoginDTO {
  loginUsername?: string;
  loginPassword?: string;
  loginLoginType: LoginType;
}

export const mapperRegister = (data: RegisterDTO): RegisterRequestDTO => {
  return {
    name: data.regiName,
    phone: data.regiPhone,
    username: data.regiUsername,
    googleAccount: data.regiGoogleAccount,
    telegramUsername: data.regiTelegramUsername,
    image: data.regiImage,
    password: data.regiPassword,
    loginType: data.regiLoginType,
    role: data.regiRole,
    // status: data.regiStatus,
  };
};
export const mapperLogin = (data: LoginDTO): LoginRequestDTO => {
  return {
    username: data.loginUsername,
    password: data.loginPassword,
    loginType: data.loginLoginType,
  };
};
export const loadingAuth = ref(false);
export async function registerService(payload: RegisterDTO) {
  try {
    loadingAuth.value = true;
    const res: any = await apiFetch(
      "POST",
      "auth/register",
      mapperRegister(payload),
    );
    if (res?.access_token) {
      storeTokenUserId(res.access_token);
    }
    navigateTo("dashbord");
    return res;
  } catch (error) {
    loadingAuth.value = true;
    console.error("Register Error", error);
  } finally {
    loadingAuth.value = false;
  }
  // console.log("Register Payload", mapperRegister(payload));
}

export async function loginService(payload: LoginDTO) {
  // console.log("Login Payload", mapperLogin(payload));
  try {
    loadingAuth.value = true;
    const res: any = await apiFetch("POST", "auth/login", mapperLogin(payload));
    console.log("Login Respone", res);
    if (res?.access_token) {
      storeTokenUserId(res.access_token);
    }
    navigateTo("dashbord");

    return res;
  } catch (error) {
    loadingAuth.value = true;
    console.error("Login Error", error);
  } finally {
    loadingAuth.value = false;
  }
}
