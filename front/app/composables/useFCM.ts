import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

export const useFCM = () => {
  const { $firebaseApp } = useNuxtApp();
  const config = useRuntimeConfig();

  const requestPermission = async (): Promise<string | null> => {
    try {
      // Only run on client
      if (!import.meta.client) return null;

      // Browser doesn't support notifications
      if (!("Notification" in window)) {
        console.warn("This browser does not support notifications.");
        return null;
      }

      // Firebase Messaging not supported
      if (!(await isSupported())) {
        console.warn("Firebase Messaging is not supported.");
        return null;
      }

      console.log("Current permission:", Notification.permission);

      // User has already blocked notifications
      if (Notification.permission === "denied") {
        console.warn("Notification permission has been denied.");
        return null;
      }

      let permission: NotificationPermission = Notification.permission;

      // Ask only if needed
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        console.warn("Notification permission not granted.");
        return null;
      }

      const messaging = getMessaging($firebaseApp);

      const token = await getToken(messaging, {
        vapidKey: config.public.firebaseVapidKey,
      });

      if (!token) {
        console.warn("Unable to retrieve FCM token.");
        return null;
      }
      return token;
    } catch (error) {
      console.error("FCM initialization failed:", error);
      return null;
    }
  };

  return {
    requestPermission,
  };
};

export const useFCMListener = () => {
  const { $firebaseApp } = useNuxtApp();

  onMounted(() => {
    const messaging = getMessaging($firebaseApp);

    onMessage(messaging, (payload) => {
      console.log("🔥 Foreground notification:", payload);

      const title = payload.notification?.title || "Notification";
      const body = payload.notification?.body || "";

      new Notification(title, {
        body,
        icon: "/icon.png",
      });
    });
  });
};

export function sendNotification(
  title: string,
  description: string,
  route: string = "/",
  logo: string = "/favicon.svg",
) {
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body: description,
    icon: logo,
  });
  // icon: "/favicon.svg",

  notification.onclick = () => {
    window.focus(); // Focus the browser window
    window.location.href = route; // Navigate to homepage
    notification.close();
  };
}
