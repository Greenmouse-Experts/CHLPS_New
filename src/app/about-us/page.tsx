import type { Metadata } from "next";
import AboutPage from "@/features/about/about_page";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ChLPS Canada is a federally incorporated not-for-profit association advancing professional competence, ethics and business understanding in loss prevention.",
};

export default function About() {
  return <AboutPage />;
}
