import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MembershipTypePage from "@/features/membership/membership_type_page";
import {
  getMembershipType,
  membershipTypeIds,
  transformMembershipApiToType,
} from "@/features/membership/membership_types";
import {
  fetchPublicMembershipBySlug,
  fetchPublicMemberships,
} from "@/features/membership/services/membership_service";

type MembershipIdPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const live = await fetchPublicMemberships().catch(() => []);
  const liveSlugs = live
    .map((item) => item.slug || item.id)
    .filter(Boolean)
    .map((id) => ({ id }));
  const staticSlugs = membershipTypeIds.map((id) => ({ id }));

  // Deduplicate params
  const map = new Map<string, { id: string }>();
  for (const item of [...liveSlugs, ...staticSlugs]) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export async function generateMetadata({
  params,
}: MembershipIdPageProps): Promise<Metadata> {
  const { id } = await params;

  // Try fetching live data by slug (GET /memberships/public/{slug})
  const apiMembership = await fetchPublicMembershipBySlug(id);
  if (apiMembership) {
    return {
      title: `${apiMembership.name} | CHLPS Canada`,
      description: apiMembership.description,
    };
  }

  const staticMembership = getMembershipType(id);
  if (staticMembership) {
    return {
      title: `${staticMembership.title} | CHLPS Canada`,
      description: staticMembership.metaDescription,
    };
  }

  return { title: "Membership | CHLPS Canada" };
}

export default async function MembershipIdPage({
  params,
}: MembershipIdPageProps) {
  const { id } = await params;

  // Fetch live membership with endpoint: GET /memberships/public/{slug}
  const apiMembership = await fetchPublicMembershipBySlug(id);

  if (apiMembership) {
    const membership = transformMembershipApiToType(apiMembership);
    return <MembershipTypePage membership={membership} slug={id} />;
  }

  // Fallback to static matching if slug doesn't exist on remote yet
  const staticMembership = getMembershipType(id);
  if (!staticMembership) {
    notFound();
  }

  return <MembershipTypePage membership={staticMembership} slug={id} />;
}
