import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MembershipTypePage from "@/features/membership/membership_type_page";
import { transformMembershipApiToType } from "@/features/membership/membership_types";
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
  return live
    .map((item) => item.slug || item.id)
    .filter(Boolean)
    .map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: MembershipIdPageProps): Promise<Metadata> {
  const { id } = await params;

  // Fetch live data by slug (GET /memberships/public/{slug})
  const apiMembership = await fetchPublicMembershipBySlug(id);
  if (apiMembership) {
    return {
      title: `${apiMembership.name} | CHLPS Canada`,
      description: apiMembership.description,
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

  // Pure live data only - do not render dummy data if membership doesn't exist
  notFound();
}
