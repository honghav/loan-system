export async function apiFetchII(endpoint: string, body?: any, token?: string, acceptLang: string = 'zh') {
  const config = useRuntimeConfig();

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Accept-Language': acceptLang
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return await $fetch(`${config.public.apiUrl}/${endpoint}`, {
    method: "POST",
    body: body,
    headers,
  });
}

export default apiFetchII;