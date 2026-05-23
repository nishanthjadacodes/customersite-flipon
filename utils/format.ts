// Display helpers — kept tiny and pure so they can be imported from
// anywhere on the customer website. Mirrors the customer app's
// utils/bookingId.ts so a booking shows the same Flip# code in both
// surfaces.

const DISPLAY_FLOOR = 1000;

/**
 * Format any booking_number / id into the customer-facing "Flip#1003"
 * form. Numbers below the 1000 floor (legacy bookings created before
 * the backend's GREATEST(MAX+1, 1000) shipped) are offset by +1000
 * so they read consistently with newer bookings. UUIDs fall back to
 * the first 4 alphanumeric chars, uppercased.
 *
 *   formatBookingId(73)   → 'Flip#1073'
 *   formatBookingId(1003) → 'Flip#1003'
 *   formatBookingId('a1b2c3d4-...') → 'Flip#A1B2'
 */
export const formatBookingId = (
  input: string | number | null | undefined,
): string => {
  if (input == null) return '';
  const raw = String(input).trim();
  if (!raw) return '';

  const digitMatch = raw.match(/(\d+)/);
  if (digitMatch) {
    const n = parseInt(digitMatch[1], 10);
    if (!Number.isNaN(n)) {
      const displayN = n < DISPLAY_FLOOR ? n + DISPLAY_FLOOR : n;
      return `Flip#${String(displayN).padStart(4, '0')}`;
    }
  }
  const fallback = raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  return fallback ? `Flip#${fallback}` : '';
};

/**
 * Format a rupee amount safely. Returns "Rs —" for undefined/null/NaN
 * inputs instead of the literal "Rs undefined" string that was
 * leaking through the bookings page when the backend omits the
 * amount field.
 */
export const formatRupees = (amount: unknown): string => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 'Rs —';
  return `Rs ${n.toLocaleString('en-IN')}`;
};
