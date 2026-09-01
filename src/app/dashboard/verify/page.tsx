import { Suspense } from "react";
import VerifyPage from "@/features/auth/pages/verify_page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
        </div>
      }
    >
      <VerifyPage />
    </Suspense>
  );
}
