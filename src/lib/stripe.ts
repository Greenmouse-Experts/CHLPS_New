import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";
import Stripe from "stripe";

// Client-side Stripe promise cache
let stripePromise: Promise<StripeClient | null> | null = null;

/**
 * Retrieves the Stripe client-side SDK instance using the publishable key.
 * Caches the initialized Stripe promise to avoid re-instantiation.
 */
export const getStripe = (): Promise<StripeClient | null> => {
  if (!stripePromise) {
    const publishableKey =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY ||
      process.env.NEXT_STRIPE_PUBLISH_KEY ||
      "";

    if (!publishableKey) {
      console.warn(
        "Stripe publishable key is not defined. Ensure NEXT_PUBLIC_STRIPE_PUBLISH_KEY or NEXT_STRIPE_PUBLISH_KEY is set in your environment.",
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

// Server-side Stripe instance cache (server components, route handlers, server actions)
let serverStripe: Stripe | null = null;

/**
 * Retrieves the Stripe server-side SDK instance using the secret key.
 * Only accessible in Node.js server environments.
 */
export const getServerStripe = (): Stripe => {
  if (typeof window !== "undefined") {
    throw new Error(
      "getServerStripe() should only be invoked in server-side contexts.",
    );
  }

  if (!serverStripe) {
    const secretKey = process.env.NEXT_STRIPE_KEY || "";
    if (!secretKey) {
      throw new Error(
        "Stripe secret key (NEXT_STRIPE_KEY) is not defined in environment.",
      );
    }

    serverStripe = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    });
  }

  return serverStripe;
};
