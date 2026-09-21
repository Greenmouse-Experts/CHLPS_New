"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  MembershipRepository,
  type UserPaidMembership,
} from "../../repository/membership_repository";

export function useUserMembership() {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [membership, setMembership] = useState<UserPaidMembership | null>(null);

  const fetchMembership = useCallback(async () => {
    try {
      setIsLoading(true);
      const repo = new MembershipRepository();
      const res = await repo.getUserPaidMembership(user.userId);
      if (res.success) {
        setMembership(res.data);
      } else {
        setMembership(null);
      }
    } catch {
      setMembership(null);
    } finally {
      setIsLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  return {
    isLoading,
    membership,
    refetch: fetchMembership,
  };
}
