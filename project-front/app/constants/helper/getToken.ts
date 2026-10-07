/**
 * Helper to get access token from cookies using runtimeConfig.public.tokenKey
 */
export default function getToken(): string | null {
  try {
    const config = useRuntimeConfig();
    const key = (config.public?.tokenKey as string) || "access_token";
    const cookieToken = useCookie<string | null>(key);
    return cookieToken.value || null;
  } catch (error) {
    console.error("Error reading token from cookie:", error);
    return null;
  }
}

export const getAuthToken = getToken;
