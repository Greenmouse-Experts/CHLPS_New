"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import PurchaseHistoryRepository from "../../repository/purchase_history_repository";
import { Order } from "../response/orders_response";

export function usePurchaseHistory() {
  const repo = new PurchaseHistoryRepository();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

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
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { isLoading, orders };
}
