/**
 * PayPal Client-Side Configuration & Helper Utilities
 * Used across Course Enrollments, Membership Applications & Event Ticket Bookings.
 */

export const getPayPalClientId = (): string => {
  return (
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    process.env.NEXT_PAYPAL_CLIENT_ID ||
    "test"
  );
};

export const getPayPalCurrency = (preferred?: string): string => {
  if (preferred && preferred.trim()) {
    return preferred.trim().toUpperCase();
  }
  return process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "CAD";
};

export interface PayPalScriptOptionsConfig {
  clientId: string;
  currency: string;
  intent?: "capture" | "authorize";
  components?: string;
  enableFunding?: string;
  disableFunding?: string;
}

export const getPayPalScriptOptions = (
  currency: string = "CAD",
): PayPalScriptOptionsConfig => {
  return {
    clientId: getPayPalClientId(),
    currency: getPayPalCurrency(currency),
    intent: "capture",
    components: "buttons",
  };
};
