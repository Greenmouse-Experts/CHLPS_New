import type { Metadata } from "next";
import MembershipPage from "@/features/membership/membership_page";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Build professional standing with ChLPS Canada through membership, certification and continuous learning at every stage of loss prevention.",
};

export default function Membership() {
  return <MembershipPage />;
}
