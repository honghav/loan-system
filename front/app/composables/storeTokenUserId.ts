export default function storeTokenUserId(token: string) {
  const config = useRuntimeConfig();
  const tokenKey = config.public.tokenKey;
  const authToken = useCookie(String(tokenKey), {
    maxAge: 60 * 60 * 2, // 1 day
    path: "/",
  });
  
  // encrypt the user ID before storing it in the cookie
  // userIdCookie.value= res.data.user.id; // Store the user ID
  authToken.value = token;
  return  authToken;
}
