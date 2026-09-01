"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import SupportRepository from "../../repository/support_repository";
import { ContactPayload, FaqItem } from "../response/support_response";

export function useSupport() {
  const repo = new SupportRepository();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchFaqs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await repo.getFaqs();
      if (res.success && res.data) {
        setFaqs([...res.data].sort((a, b) => a.order - b.order));
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const sendMessage = async (payload: ContactPayload) => {
    setSending(true);
    const res = await repo.sendMessage(payload);
    setSending(false);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    return res.success;
  };

  return { faqs, isLoading, sending, sendMessage };
}
