import EventsDashboardPage from "@/features/dashboard/pages/events_page";

export const metadata = {
  title: "My Events | Dashboard - CHLPS",
  description:
    "View your confirmed event registrations, access passes, and virtual meeting links.",
};

export default function Page() {
  return <EventsDashboardPage />;
}
