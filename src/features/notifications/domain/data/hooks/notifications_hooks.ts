"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import NotificationsRepository from "../../repository/notifications_repository";
import { NotificationItem } from "../response/notifications_response";

export function useNotifications() {
  const repo = new NotificationsRepository();
  const [tab, setTab] = useState<"read" | "unread">("unread");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await repo.getNotifications(tab, page);
      if (res.success && res.data) {
        setItems(res.data.items);
        setCount(res.data.count);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAll = async () => {
    setMarking(true);
    const res = await repo.markAllRead();
    setMarking(false);
    if (res.success) {
      toast.success(res.message);
      fetchNotifications();
    } else {
      toast.error(res.message);
    }
  };

  const markOne = async (id: string, read: boolean) => {
    if (read) return;
    const res = await repo.markRead(id);
    if (res.success) fetchNotifications();
    else toast.error(res.message);
  };

  return {
    tab,
    setTab: (next: "read" | "unread") => {
      setPage(1);
      setTab(next);
    },
    page,
    setPage,
    isLoading,
    items,
    count,
    marking,
    markAll,
    markOne,
  };
}
