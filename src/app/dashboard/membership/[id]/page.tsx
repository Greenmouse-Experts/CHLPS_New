import MembershipDetailPage from "@/features/dashboard/pages/membership_detail_page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MembershipDetailPage id={id} />;
}
