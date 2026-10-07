export function useV2Api() {
  const config = useRuntimeConfig();

  // Resolve base URL for NestJS Core backend (default to http://localhost:8000/api/v2)
  const getBaseUrl = (): string => {
    // 1. Explicit v2ApiUrl if provided
    if (config.public.v2ApiUrl) {
      return config.public.v2ApiUrl.replace(/\/+$/, '');
    }

    let rawUrl = config.public.baseUrl || config.public.apiUrl || 'http://localhost:8000/api/v2';
    
    // Normalize slashes
    rawUrl = rawUrl.trim().replace(/\/+$/, '');

    // Remove unintended /v1 path segments for v2 requests
    rawUrl = rawUrl.replace(/\/v1\/api\/v2$/, '/api/v2');
    rawUrl = rawUrl.replace(/\/v1$/, '');

    if (rawUrl.endsWith('/api/v2')) {
      return rawUrl;
    }

    if (rawUrl.endsWith('/api')) {
      return `${rawUrl}/v2`;
    }

    return `${rawUrl}/api/v2`;
  };

  const baseUrl = getBaseUrl();

  const apiFetch = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    } = {},
  ): Promise<T> => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    try {
      return await $fetch<T>(url, {
        method: options.method || 'GET',
        body: options.body,
        params: options.params,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    } catch (err: any) {
      console.error(`[V2 API Error] ${options.method || 'GET'} ${url}:`, err);
      throw err;
    }
  };

  return {
    baseUrl,
    apiFetch,
  };
}

export default useV2Api;
