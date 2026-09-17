import type { Metadata } from "next";
import MembershipQuestionsPage from "@/features/membership/pages/membership_questions_page";

type MembershipQuestionsRouteProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: MembershipQuestionsRouteProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Membership Screening Questions | CHLPS Canada",
    description: "Complete your eligibility assessment for CHLPS membership.",
  };
}

export default async function MembershipQuestionsRoute({
  params,
}: MembershipQuestionsRouteProps) {
  const { id } = await params;
  return <MembershipQuestionsPage id={id} />;
}
