import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import Providers from "@/lib/providers/providers";
import "./globals.css";

const como = localFont({
  src: [
    { path: "./fonts/Como-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "./fonts/Como-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Como.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Como-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Como-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Como-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Como-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./fonts/Como-Heavy.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-como",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CHLPS | Association of Chartered Loss Prevention Specialists of Canada",
    template: "%s | CHLPS",
  },
  description:
    "The Association of Chartered Loss Prevention Specialists of Canada — advancing professional standards, education, and membership in loss prevention.",
  icons: {
    icon: "/assets/images/chips-logo.png",
    apple: "/assets/images/chips-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${como.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans bg-cream text-text">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
