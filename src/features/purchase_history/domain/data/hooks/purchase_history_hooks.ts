"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import PurchaseHistoryRepository from "../../repository/purchase_history_repository";
import { Order } from "../response/orders_response";

export function usePurchaseHistory() {
  const repo = useRef(new PurchaseHistoryRepository()).current;
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const hasVerifiedRef = useRef(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await repo.getOrders();
      if (res.success && res.data) setOrders(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Failed to load purchase history");
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get("payment_intent");
    const reference =
      urlParams.get("reference") ||
      urlParams.get("trxref") ||
      urlParams.get("thirdPartyRef");
    const redirectStatus = urlParams.get("redirect_status");

    const thirdPartyRef = paymentIntent || reference;

    if (thirdPartyRef && !hasVerifiedRef.current) {
      hasVerifiedRef.current = true;
      (async () => {
        try {
          if (redirectStatus === "failed") {
            toast.error("Payment failed or was cancelled.");
          } else {
            const confirmRes = await repo.confirmOrder(thirdPartyRef);
            if (confirmRes.success) {
              toast.success("Payment confirmed! Your enrollment is active.");
            } else {
              toast.info("Payment received. Processing your transaction...");
            }
          }
        } catch {
          toast.error("Error verifying payment reference.");
        } finally {
          // Remove query params from browser URL cleanly without reloading
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          fetchOrders();
        }
      })();
      return;
    }

    fetchOrders();
  }, [fetchOrders, repo]);

  return { isLoading, orders, refetch: fetchOrders };
}
