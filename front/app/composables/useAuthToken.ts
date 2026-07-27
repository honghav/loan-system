// composables/useAuthToken.ts
export const useAuthToken = () => {
  const config = useRuntimeConfig();
  const token = useCookie(config.public.tokenKey);
  return token;
};
