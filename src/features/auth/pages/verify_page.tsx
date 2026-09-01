"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import LoadingOverlay from "@/components/shared/loading_overlay";
import { useAuthHooks } from "../data/hooks/auth.hooks";
import AuthHero from "../components/auth_hero";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { isLoading, handleVerifyEmail } = useAuthHooks();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      const success = await handleVerifyEmail(token);
      setStatus(success ? "success" : "error");
      if (success) {
        setTimeout(() => router.replace("/dashboard/sign-in"), 2500);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-cream">
      {isLoading && <LoadingOverlay />}
      <AuthHero
        badge="Verify email"
        title={
          <>
            Confirming your <span className="text-secondary">account.</span>
          </>
        }
        description="Please wait while we verify your email address."
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-sand bg-white p-8 text-center">
          <h2 className="text-2xl font-medium text-primary">
            {status === "success"
              ? "Email verified"
              : status === "error"
                ? "Verification failed"
                : "Verifying…"}
          </h2>
          <p className="mt-3 text-text/65">
            {status === "success"
              ? "Your account is active. Redirecting you to sign in."
              : status === "error"
                ? "This verification link is invalid or has expired."
                : "This will only take a moment."}
          </p>
          {status !== "idle" && (
            <Button
              className="mt-8"
              fullWidth
              onClick={() => router.push("/dashboard/sign-in")}
            >
              Go to sign in
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default VerifyPage;
