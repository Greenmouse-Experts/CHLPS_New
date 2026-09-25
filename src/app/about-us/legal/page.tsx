import type { Metadata } from "next";
import LegalPage from "@/features/about/legal_page";

export const metadata: Metadata = {
  title: "Legal & Accreditations | CHLPS Canada",
  description:
    "Official legal charters, federal incorporation, and international accreditations of the Association of Chartered Loss Prevention Specialists of Canada.",
};

export default function Legal() {
  return <LegalPage />;
}
