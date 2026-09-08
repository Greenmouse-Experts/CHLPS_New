import type { Metadata } from "next";
import CertificationPage from "@/features/certification/certification_page";

export const metadata: Metadata = {
  title: "Certification Program",
  description:
    "Earn CLPA, CLPO, CLPM and ChLPS credentials through the Association of Chartered Loss Prevention Specialists of Canada professional certification pathway.",
};

export default function Certification() {
  return <CertificationPage />;
}
