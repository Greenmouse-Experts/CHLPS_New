"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import {
  Button,
  Checkbox,
  COUNTRIES,
  Modal,
  PasswordField,
  PhoneField,
  TextField,
} from "@/components/ui";
import LoadingOverlay from "@/components/shared/loading_overlay";
import { Assets } from "@/lib/assets";
import { useAuthHooks } from "../data/hooks/auth.hooks";
import { AuthValidations } from "../validations/validations";
import AuthHero from "../components/auth_hero";

const RegisterPage = () => {
  const router = useRouter();
  const { isLoading, handleRegisterUser } = useAuthHooks();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("CA");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    validationSchema: AuthValidations.registerValidationSchema,
    onSubmit: async (values) => {
      const country = COUNTRIES.find((item) => item.code === countryCode);
      const digits = values.phone.replace(/\s+/g, "");
      const phone = digits.startsWith("+")
        ? digits
        : `${country?.dial ?? "+1"}${digits.replace(/^0+/, "")}`;

      const success = await handleRegisterUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone,
        password: values.password,
      });

      if (success) {
        setSubmittedEmail(values.email);
        setModalOpen(true);
      }
    },
  });

  return (
    <div className="min-h-screen bg-cream">
      {isLoading && <LoadingOverlay />}
      <AuthHero
        badge="Register"
        title={
          <>
            Create your <span className="text-secondary">account.</span>
          </>
        }
        description="Join professionals advancing their careers in corporate security, loss prevention, and risk management."
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
              Begin your learning <span className="text-secondary">journey</span>
            </h2>
            <p className="mt-2 max-w-sm text-center text-text/70">
              Create your profile to access programs, certifications, and member
              resources.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                name="firstName"
                label="First name"
                placeholder="Enter first name"
                required
                size="lg"
                value={formik.values.firstName}
                error={formik.errors.firstName}
                touched={formik.touched.firstName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <TextField
                name="lastName"
                label="Last name"
                placeholder="Enter last name"
                required
                size="lg"
                value={formik.values.lastName}
                error={formik.errors.lastName}
                touched={formik.touched.lastName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>

            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email"
              required
              size="lg"
              value={formik.values.email}
              error={formik.errors.email}
              touched={formik.touched.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <PhoneField
              name="phone"
              label="Phone number"
              placeholder="Enter phone number"
              required
              size="lg"
              countryCode={countryCode}
              value={formik.values.phone}
              error={formik.errors.phone}
              touched={formik.touched.phone}
              onBlur={formik.handleBlur}
              onChange={(value) => formik.setFieldValue("phone", value)}
              onCountryChange={(country) => setCountryCode(country.code)}
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

            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              required
              size="lg"
              value={formik.values.confirmPassword}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />

            <Checkbox
              name="agree"
              checked={formik.values.agree}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.agree ? formik.errors.agree : undefined
              }
              label={
                <span>
                  I have read and agreed to the CHLPS{" "}
                  <Link href="/#privacy" className="font-medium text-primary underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/#terms" className="font-medium text-primary underline">
                    Terms of Use
                  </Link>
                </span>
              }
            />

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
              Create account
            </Button>
          </form>

          <p className="mt-8 text-center text-text/60">
            Already have an account?{" "}
            <Link
              href="/dashboard/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        persistent
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F8F1] text-[#38CB89]">
            <HugeiconsIcon icon={Mail01Icon} size={32} color="currentColor" />
          </span>
          <h3 className="mt-6 text-2xl font-medium text-primary">
            Check your inbox
          </h3>
          <p className="mt-3 leading-relaxed text-text/60">
            A verification mail has been sent to{" "}
            <span className="font-medium text-primary">{submittedEmail}</span>.
            Please verify your email to activate your account.
          </p>
          <Button
            type="button"
            variant="primary"
            fullWidth
            className="mt-8"
            rightIcon={
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" />
            }
            onClick={() => {
              setModalOpen(false);
              router.push("/dashboard/sign-in");
            }}
          >
            Sign in now
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterPage;
