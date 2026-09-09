import type { Metadata } from "next";
import CareersPage from "@/features/careers/careers_page";

export const metadata: Metadata = {
  title: "Career Centre",
  description:
    "Explore loss prevention career paths in Canada, search live opportunities and find the CHLPS membership or certification route that supports your growth.",
};

export default function CareerCentre() {
  return <CareersPage />;
}
