"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  MembershipRepository,
  type UserPaidMembership,
  type UserMembershipDetail,
  type UserEnrolledMembership,
  type MembershipCertificateResult,
} from "../../repository/membership_repository";

/**
 * Fetches the user's primary active membership for top-level dashboard overview.
 */
export function useUserMembership() {
  const user = useSelector((state: RootState) => state.user);
  const repo = new MembershipRepository();

  const query = useQuery<UserPaidMembership | null>({
    queryKey: ["user-membership", user?.userId],
    queryFn: async () => {
      const res = await repo.getUserPaidMembership(user.userId);
      return res.success && res.data ? res.data : null;
    },
    enabled: Boolean(user?.userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    membership: query.data ?? null,
    refetch: query.refetch,
    query,
  };
}

/**
 * Fetches all membership applications submitted by the user.
 */
export function useUserMembershipApplications() {
  const user = useSelector((state: RootState) => state.user);
  const repo = new MembershipRepository();

  const query = useQuery<UserMembershipDetail[]>({
    queryKey: ["user-membership-applications", user?.userId],
    queryFn: async () => {
      const res = await repo.getMyMembershipApplications(user.userId);
      return res.success && res.data ? res.data : [];
    },
    enabled: Boolean(user?.userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    applications: query.data ?? [],
    refetch: query.refetch,
    query,
  };
}

/**
 * Fetches a single membership application by ID or slug.
 */
export function useUserMembershipApplicationDetail(id: string) {
  const user = useSelector((state: RootState) => state.user);
  const repo = new MembershipRepository();

  const query = useQuery<UserMembershipDetail | null>({
    queryKey: ["user-membership-application-detail", id, user?.userId],
    queryFn: async () => {
      if (!id) return null;
      const res = await repo.getMyMembershipApplicationById(id, user.userId);
      return res.success && res.data ? res.data : null;
    },
    enabled: Boolean(id) && Boolean(user?.userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    application: query.data ?? null,
    refetch: query.refetch,
    query,
  };
}

/**
 * Fetches specific membership certificate for an application or enrolled membership.
 */
export function useMembershipCertificate(
  membershipId?: string,
  studentId?: string,
) {
  const repo = new MembershipRepository();

  const query = useQuery<MembershipCertificateResult | null>({
    queryKey: ["membership-certificate", membershipId, studentId],
    queryFn: async () => {
      if (!membershipId) return null;
      const res = await repo.getMembershipCertificate(membershipId, studentId);
      return res.success && res.data ? res.data : null;
    },
    enabled: Boolean(membershipId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    certificate: query.data ?? null,
    certificateUrl: query.data?.certificateUrl,
    certificateId: query.data?.certificateId,
    refetch: query.refetch,
    query,
  };
}

/**
 * Fetches user's active/enrolled student memberships (from /memberships/my-memberships).
 */
export function useUserEnrolledMemberships() {
  const user = useSelector((state: RootState) => state.user);
  const repo = new MembershipRepository();

  const query = useQuery<UserEnrolledMembership[]>({
    queryKey: ["user-enrolled-memberships", user?.userId],
    queryFn: async () => {
      const res = await repo.getMyEnrolledMemberships();
      return res.success && res.data ? res.data : [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    memberships: query.data ?? [],
    data: query.data ?? [],
    refetch: query.refetch,
    query,
  };
}
