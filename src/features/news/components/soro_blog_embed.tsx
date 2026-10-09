"use client";

import HeaderText from "@/components/HeaderText";
import Script from "next/script";

const SORO_EMBED_SRC =
  "https://app.trysoro.com/api/embed/922e955e-6a53-4ac8-b781-03afe621bb1c";

export default function SoroBlogEmbed() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <HeaderText left="More" right="Blogs" smallSize notUppercase />
        <div id="soro-blog" />
      </div>
      <Script src={SORO_EMBED_SRC} strategy="afterInteractive" />
    </section>
  );
}
