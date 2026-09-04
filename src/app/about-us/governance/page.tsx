import type { Metadata } from "next";
import GovernancePage from "@/features/about/governance_page";

export const metadata: Metadata = {
  title: "Our Governance",
  description:
    "ChLPS Canada is led by its Board of Directors and Association Management Team, providing strategic oversight, professional standards and effective operations.",
};

export default function Governance() {
  return <GovernancePage />;
}
