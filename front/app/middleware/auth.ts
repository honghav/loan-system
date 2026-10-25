import { UserRole } from "~/model_dto/auth/user_enum.dto";
import {
  currentUserData,
  getCurrentUserService,
} from "~/model_dto/auth/get_current_user.dto";

// TypeScript augmentations for route meta
declare module "#app" {
  interface PageMeta {
    roles?: (UserRole | string)[] | UserRole | string;
    allowedRoles?: (UserRole | string)[] | UserRole | string;
    role?: UserRole | string;
    redirectOnForbidden?: string;
  }
}

declare module "vue-router" {
  interface RouteMeta {
    roles?: (UserRole | string)[] | UserRole | string;
    allowedRoles?: (UserRole | string)[] | UserRole | string;
    role?: UserRole | string;
    redirectOnForbidden?: string;
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useAuthToken();

  // 1. Check if token exists
  if (!token.value) {
    return navigateTo("/auth");
  }

  // 2. Fetch current user data if not yet loaded
  if (!currentUserData.value) {
    await getCurrentUserService(token.value as string);
  }

  // If user profile could not be loaded (invalid or expired token)
  if (!currentUserData.value) {
    token.value = null;
    return navigateTo("/auth");
  }

  // 3. Check role authorization if specified in route meta
  const rawRoles = to.meta.roles ?? to.meta.allowedRoles ?? to.meta.role;

  if (rawRoles) {
    const allowedRoles: string[] = (
      Array.isArray(rawRoles) ? rawRoles : [rawRoles]
    ).map((r) => String(r).toLowerCase());

    const userRoleRaw =
      currentUserData.value.Role || (currentUserData.value as any).role || "";
    const userRoles = Array.isArray(userRoleRaw)
      ? userRoleRaw.map((r) => String(r).toLowerCase())
      : String(userRoleRaw)
          .split(",")
          .map((r) => r.trim().toLowerCase())
          .filter(Boolean);

    const hasPermission =
      allowedRoles.length === 0 ||
      allowedRoles.includes("*") ||
      userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      // If user role does not match, redirect to fallback page or abort with 403
      const redirectPath =
        (to.meta.redirectOnForbidden as string) || "/dashbord";

      if (to.path !== redirectPath) {
        return navigateTo(redirectPath);
      }

      return abortNavigation({
        statusCode: 403,
        statusMessage: "You do not have permission to access this page.",
      });
    }
  }
});