"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button, PasswordField, TextField } from "@/components/ui";
import LoadingOverlay from "@/components/shared/loading_overlay";
import { Assets } from "@/lib/assets";
import { useAuthHooks } from "../data/hooks/auth.hooks";
import { AuthValidations } from "../validations/validations";
import AuthHero from "../components/auth_hero";

const SignInPage = () => {
  const { isLoading, handleLoginUser } = useAuthHooks();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: AuthValidations.loginValidationSchema,
    onSubmit: async (values) => {
      await handleLoginUser({ email: values.email, password: values.password });
    },
  });

  return (
    <div className="min-h-screen bg-cream">
      {isLoading && <LoadingOverlay />}
      <AuthHero
        badge="Sign in"
        title={
          <>
            Welcome back to your{" "}
            <span className="text-secondary">account.</span>
          </>
        }
        description="Sign in to continue your professional training, access your programs, and manage your member profile."
      />

      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sand bg-white p-8 md:p-14">
          <div className="mb-12 flex flex-col items-center">
            <div className="flex items-center justify-center bg-primary px-8 py-5">
              <Image
                src={Assets.icons.logo}
                alt="CHLPS"
                width={180}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <h2 className="mt-8 text-center text-2xl font-medium text-primary md:text-3xl">
              Sign in to continue your{" "}
              <span className="text-secondary">journey</span>
            </h2>
          </div>

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

            <PasswordField
              name="password"
              label="Password"
              placeholder="Enter password"
              required
              size="lg"
              value={formik.values.password}
              error={formik.errors.password}
              touched={formik.touched.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <p className="text-sm text-text/70">
              Forgot password?{" "}
              <Link
                href="/dashboard/reset-password"
                className="font-bold text-primary hover:underline"
              >
                Reset password
              </Link>
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="mt-1 h-[50px]"
              rightIcon={
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" />
              }
            >
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-text/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/dashboard/register"
              className="font-medium text-secondary hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
