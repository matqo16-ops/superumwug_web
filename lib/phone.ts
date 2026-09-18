/**
 * "+49 176 228 661 46" → "tel:+4917622866146". One helper for every tap-to-call
 * link: the footer once shipped a regex typo that turned every number into
 * "tel:+", which a test now guards against.
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!/\d{6,}/.test(digits)) throw new Error(`Not a phone number: "${phone}"`);
  return `tel:${digits}`;
}
