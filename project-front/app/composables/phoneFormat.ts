import { ref } from "vue";

export const usePhoneFormatter = () => {
  const phoneErrorMessage = ref("");
  const { t } = useI18n();
  const formatPhone = (phone: string | number | null | undefined): string => {
    if (!phone) return "";

    // 1. Strip all non-numeric characters
    let cleaned = String(phone).replace(/\D/g, "");

    // 2. Enforce the leading 0 if missing
    if (cleaned.length > 0 && !cleaned.startsWith("0")) {
      cleaned = `0${cleaned}`;
    }

    // 3. Keep maximum of 10 actual digits
    cleaned = cleaned.slice(0, 10);

    // 4. Return spaced grouping visually (e.g., "012 345 678" or "012 345 6789")
    if (cleaned.length <= 3) {
      return cleaned;
    }

    if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }

    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  };

  const allowOnlyNumbers = (event: KeyboardEvent) => {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      phoneErrorMessage.value = t("phone_number_only_digits");
    } else {
      phoneErrorMessage.value = "";
    }
  };
  const allowOnlyIntegers = (event: KeyboardEvent) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return {
    formatPhone,
    allowOnlyNumbers,
    allowOnlyIntegers,
    phoneErrorMessage,
  };
};
