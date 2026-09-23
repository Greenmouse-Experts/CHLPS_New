"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  MembershipRepository,
  type UserPaidMembership,
  type UserMembershipDetail,
} from "../../repository/membership_repository";

/**
 * Fetches the user's primary active membership for top-level dashboard overview.
 */
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

/**
 * Fetches all membership applications submitted by the user.
 */
export function useUserMembershipApplications() {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<UserMembershipDetail[]>([]);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const repo = new MembershipRepository();
      const res = await repo.getMyMembershipApplications(user.userId);
      if (res.success && res.data) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    isLoading,
    applications,
    refetch: fetchApplications,
  };
}

/**
 * Fetches a single membership application by ID or slug.
 */
export function useUserMembershipApplicationDetail(id: string) {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<UserMembershipDetail | null>(
    null,
  );

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const repo = new MembershipRepository();
      const res = await repo.getMyMembershipApplicationById(id, user.userId);
      if (res.success) {
        setApplication(res.data);
      } else {
        setApplication(null);
      }
    } catch {
      setApplication(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, user.userId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    isLoading,
    application,
    refetch: fetchDetail,
  };
}
