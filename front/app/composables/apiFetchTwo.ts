export async function apiFetch(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  body?: any,
  token?: string,
  acceptLang: string = "KH",
) {
  const config = useRuntimeConfig();
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (acceptLang) {
    headers["Accept-Language"] = acceptLang;
  }

  const tokenKey = config.public.tokenKey;
  const tokenToUse = token || (tokenKey ? useCookie(String(tokenKey)).value : undefined);

  if (tokenToUse) {
    (headers as Record<string, string>).Authorization = `Bearer ${tokenToUse}`;
  }

  return await $fetch(`${config.public.baseUrl}/${endpoint}`, {
    method: method,
    body,
    headers,
  });
}

export default apiFetch;
