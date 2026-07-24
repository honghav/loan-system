import { useFCM } from "~/composables/useFCM";
import { useDeviceId } from "~/composables/gen_devideid";
import { addOrUpdateFCMTokenServer } from "~~/server/fcm_tokenServer";
export async function addOrUpdateFCMToken(token: string, acceptLang?: string) {
  const { requestPermission } = useFCM();

  const tokenFCM = await requestPermission();
  if (!tokenFCM) {
    console.warn("FCM token not available. Skipping registration.");
    return;
  }
  const { getDeviceId } = useDeviceId();

  const fcmPayload = {
    fcm_token: tokenFCM,
    device_id: getDeviceId(),
  };

  try {
    return await addOrUpdateFCMTokenServer(fcmPayload, token, acceptLang);
  } catch (error) {
    console.error("Error fetching promotion data:", error);
    throw error;
  }
}
