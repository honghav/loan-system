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

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return await $fetch(`${config.public.baseUrl}/${endpoint}`, {
    method: method,
    body,
    headers,
  });
}

export default apiFetch;
