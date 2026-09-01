"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { Button, TextField } from "@/components/ui";
import LoadingOverlay from "@/components/shared/loading_overlay";
import { useAuthHooks } from "../data/hooks/auth.hooks";
import { AuthValidations } from "../validations/validations";
import AuthHero from "../components/auth_hero";

const ResetPasswordPage = () => {
  const { isLoading, handleRequestPasswordReset } = useAuthHooks();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: AuthValidations.resetPasswordValidationSchema,
    onSubmit: async (values) => {
      await handleRequestPasswordReset({ email: values.email });
    },
  });

  return (
    <div className="min-h-screen bg-cream">
      {isLoading && <LoadingOverlay />}
      <AuthHero
        badge="Reset password"
        title={
          <>
            Recover your <span className="text-secondary">account.</span>
          </>
        }
        description="Enter the email associated with your member account and we will send a reset link."
      />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-sand bg-white p-8">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              size="lg"
              value={formik.values.email}
              error={formik.errors.email}
              touched={formik.touched.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Send reset link
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-text/60">
            Remembered your password?{" "}
            <Link href="/dashboard/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordPage;
