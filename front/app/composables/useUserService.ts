import { apiFetch } from "./apiFetchTwo";
import { UserRole, LoginType, UserStatus } from "~/model_dto/auth/user_enum.dto";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  googleAccount?: string;
  appleId?: string;
  facebookId?: string;
  telegramChatId?: string;
  telegramUsername?: string;
  telegramLinked?: string;
  image?: string;
  loginType?: LoginType;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
  telegramUsername?: string;
  telegramChatId?: string;
  telegramLinked?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

/**
 * Update general user account information by ID (PATCH /v1/users/:id)
 */
export async function updateUserService(id: string, payload: UpdateUserPayload) {
  return await apiFetch("PATCH", `users/${id}`, payload);
}

/**
 * Update user status by ID (PATCH /v1/users/:id/status)
 */
export async function updateUserStatusService(id: string, status: UserStatus) {
  return await apiFetch("PATCH", `users/${id}/status`, { status });
}

/**
 * Change or reset user password by ID (PATCH /v1/users/:id/change-password)
 */
export async function changeUserPasswordService(id: string, payload: ChangePasswordPayload) {
  return await apiFetch("PATCH", `users/${id}/change-password`, payload);
}

/**
 * Update user profile by ID (or "me") (PATCH /v1/users/:id/profile)
 */
export async function updateProfileService(id: string, payload: UpdateProfilePayload) {
  return await apiFetch("PATCH", `users/${id}/profile`, payload);
}

/**
 * Get user by ID (GET /v1/users/:id)
 */
export async function getUserByIdService(id: string) {
  return await apiFetch("GET", `users/${id}`);
}
