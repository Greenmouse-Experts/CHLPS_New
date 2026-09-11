import { Suspense } from "react";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import PoliciesHeroSection from "@/features/policies/components/policies_hero_section";
import PoliciesContentSection from "@/features/policies/components/policies_content_section";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PoliciesHeroSection />
      <Suspense>
        <PoliciesContentSection />
      </Suspense>
      <Footer />
    </div>
  );
}
