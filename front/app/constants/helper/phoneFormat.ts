/**
 * Validates whether a given phone number string is valid.
 * Supports Cambodian numbers (starting with 0, 9-10 digits) and international numbers (+855... 8-15 digits).
 *
 * @param phone Phone number string to validate
 * @returns boolean True if valid phone format
 */
export function validatePhoneNumber(phone?: string | null): boolean {
  if (!phone || typeof phone !== "string") {
    return false;
  }

  // Remove spaces, hyphens, parentheses, and dots
  const sanitized = phone.replace(/[\s\-\(\)\.]/g, "");

  // Must contain only digits, optionally starting with a single leading '+'
  if (!/^\+?\d+$/.test(sanitized)) {
    return false;
  }

  // Cambodian local format starting with '0': 9 to 10 digits (e.g. 012345678, 0971234567)
  if (sanitized.startsWith("0")) {
    return sanitized.length >= 9 && sanitized.length <= 10;
  }

  // International format starting with '+' (e.g. +85512345678)
  if (sanitized.startsWith("+")) {
    const digitsOnly = sanitized.slice(1);
    return digitsOnly.length >= 8 && digitsOnly.length <= 15;
  }

  // Standard digits length without prefix: 8 to 15 digits
  return sanitized.length >= 8 && sanitized.length <= 15;
}

/**
 * Default export function for checking phone format.
 */
export default function PhoneFormat(phone?: string | null): boolean {
  return validatePhoneNumber(phone);
}

/**
 * Formats a raw phone string into a clean readable string (e.g. 012 345 678 or +855 12 345 678).
 */
export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const sanitized = phone.replace(/[\s\-\(\)\.]/g, "");

  // Format 9-digit local phone: e.g. 012 345 678
  if (/^0\d{8}$/.test(sanitized)) {
    return `${sanitized.slice(0, 3)} ${sanitized.slice(3, 6)} ${sanitized.slice(6)}`;
  }

  // Format 10-digit local phone: e.g. 097 123 4567
  if (/^0\d{9}$/.test(sanitized)) {
    return `${sanitized.slice(0, 3)} ${sanitized.slice(3, 6)} ${sanitized.slice(6)}`;
  }

  // Format +855 international phone: e.g. +855 12 345 678
  if (sanitized.startsWith("+855")) {
    const rest = sanitized.slice(4);
    if (rest.length === 8) {
      return `+855 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
    }
    if (rest.length === 9) {
      return `+855 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
    }
  }

  return sanitized;
}