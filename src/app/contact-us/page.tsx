import type { Metadata } from "next";
import ContactPage from "@/features/contact/contact_page";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact CHLPS Canada for membership, certification, events and general enquiries — call, email or send a message to our Windsor, Ontario office.",
};

export default function ContactUs() {
  return <ContactPage />;
}
