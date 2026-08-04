// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  // srcDir: "src/", // <-- If this line exists, your server folder MUST be moved inside src/
  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },
  compatibilityDate: "2025-01-15",

  // eslint: {
  //   config: {
  //     stylistic: {
  //       commaDangle: "never",
  //       braceStyle: "1tbs",
  //     },
  //   },
  // },
  app: {
    head: {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_API_KEY}&libraries=places`,
          async: true,
          defer: true,
        },
      ],
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      htmlAttrs: {
        class: "light", // force light class at render
      },
    },
  },
  serverDir: "app/server",
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      baseUrl: process.env.BASE_URL,
      appUrl: process.env.APP_URL,
      googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
      tokenKey: process.env.COOKIE_KEY,
      // Firebase Config
      firebaseApiKey: process.env.PAPA_FOOD_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.PAPA_FOOD_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.PAPA_FOOD_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.PAPA_FOOD_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.PAPA_FOOD_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.PAPA_FOOD_FIREBASE_APP_ID,
      firebaseVapidKey: process.env.PAPA_FOOD_FIREBASE_VAPID_KEY,
    },
  },
  routeRules: {
    "/**": { ssr: true },
  },

  modules: [
    "@nuxtjs/color-mode",
    // "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/hints",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "nuxt-anchorscroll",
    "@nuxt/fonts",
  ],
  i18n: {
    defaultLocale: "KH",
    locales: [
      { code: "KH", name: "Khmer", file: "km.json" },
      { code: "EN", name: "English", file: "en.json" },
      { code: "CH", name: "Chinese", file: "zh.json" },
    ],
    langDir: "locales/",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: false,
      // fallbackLocale: "KH",
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["import", "global-builtin", "color-functions"],
        },
      },
    },
  },

  devtools: {
    enabled: true,
  },
});
