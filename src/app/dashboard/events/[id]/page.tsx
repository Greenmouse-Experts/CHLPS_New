import DashboardEventDetailPage from "@/features/dashboard/pages/event_detail_page";

export const metadata = {
  title: "Event Details | Dashboard - CHLPS",
  description: "View registration pass details, virtual session access, and attendance information.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DashboardEventDetailPage id={id} />;
}
