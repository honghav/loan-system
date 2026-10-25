export const useAuthToken = () => {
    const config = useRuntimeConfig();
    const tokenKey = config.public.tokenKey;
    const authToken = useCookie<string | null>(tokenKey, {
        default: () => null,
    });

    return authToken;
};