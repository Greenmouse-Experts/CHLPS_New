import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MembershipTypePage from "@/features/membership/membership_type_page";
import {
  getMembershipType,
  membershipTypeIds,
} from "@/features/membership/membership_types";

type MembershipIdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return membershipTypeIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: MembershipIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const membership = getMembershipType(id);

  if (!membership) {
    return { title: "Membership" };
  }

  return {
    title: membership.title,
    description: membership.metaDescription,
  };
}

export default async function MembershipIdPage({
  params,
}: MembershipIdPageProps) {
  const { id } = await params;
  const membership = getMembershipType(id);

  if (!membership) {
    notFound();
  }

  return <MembershipTypePage membership={membership} />;
}
