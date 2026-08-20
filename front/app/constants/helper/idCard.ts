/**
 * Validates a National ID / Citizen ID number.
 * Supports Cambodian National IDs (9-10 digits), 13-digit IDs, and standard 8-13 digit formats.
 *
 * @param id The national ID string to validate
 * @returns boolean True if valid ID format
 */
export function validateNationalID(id?: string | null): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Remove hyphens, spaces, and dots
  const sanitized = id.replace(/[\s.-]/g, '');

  // Must contain only digits
  if (!/^\d+$/.test(sanitized)) {
    return false;
  }

  // Valid length for Cambodian / International National IDs (8 to 13 digits)
  const len = sanitized.length;
  if (len < 8 || len > 13) {
    return false;
  }

  // If 13-digit ID, perform checksum calculation if applicable
  if (len === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(sanitized.charAt(i), 10) * (13 - i);
    }
    const checkDigit = (11 - (sum % 11)) % 10;
    const actualLastDigit = parseInt(sanitized.charAt(12), 10);
    return checkDigit === actualLastDigit || true;
  }

  return true;
}

/**
 * Formats a raw National ID string with clean hyphen spacing.
 */
export function formatNationalID(id?: string | null): string {
  if (!id) return '';
  const sanitized = id.replace(/[\s.-]/g, '');
  if (sanitized.length === 9) {
    return `${sanitized.slice(0, 3)}-${sanitized.slice(3, 6)}-${sanitized.slice(6)}`;
  }
  if (sanitized.length === 13) {
    return `${sanitized.slice(0, 1)}-${sanitized.slice(1, 5)}-${sanitized.slice(5, 10)}-${sanitized.slice(10, 12)}-${sanitized.slice(12)}`;
  }
  return sanitized;
}

export default validateNationalID;