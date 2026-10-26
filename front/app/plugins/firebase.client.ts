import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const apiKey = config.public.firebaseApiKey;
  const projectId = config.public.firebaseProjectId;

  if (!apiKey || !projectId) {
    console.warn(
      "[Firebase] Firebase API key or Project ID is missing in runtimeConfig. Firebase services are disabled.",
    );
    return {
      provide: {
        firebaseApp: null as FirebaseApp | null,
        firebaseAuth: null,
      },
    };
  }

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: null,
      },
    };
  } catch (error) {
    console.error("[Firebase] Error initializing Firebase App:", error);
    return {
      provide: {
        firebaseApp: null as FirebaseApp | null,
        firebaseAuth: null,
      },
    };
  }
});

