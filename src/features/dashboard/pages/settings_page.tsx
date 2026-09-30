"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DashboardLayout } from "@/components";
import { Button, TextField } from "@/components/ui";
import LoadingOverlay from "@/components/shared/loading_overlay";
import { RootState } from "@/lib/store/store";
import { useAuthHooks } from "@/features/auth/data/hooks/auth.hooks";

const SettingsPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const {
    isLoading,
    handleLoadProfile,
    handleUpdateProfile,
    handleUploadImage,
  } = useAuthHooks();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleLoadProfile();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phoneNumber || "",
      address: user.address || "",
      country: user.country || "",
      stateProvince: user.stateProvince || "",
      placeOfWork: user.placeOfWork || "",
      officialDesignation: user.officialDesignation || "",
      currentEducationOrProfessionalQualification:
        user.currentEducationOrProfessionalQualification || "",
      facebookUrl: user.facebookUrl || "",
      twitterUrl: user.twitterUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      bio: user.bio || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
    }),
    onSubmit: async (values) => {
      await handleUpdateProfile(values);
    },
  });

  const registrationDate = user.createdDate
    ? new Date(user.createdDate).toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "M";

  return (
    <DashboardLayout title="My Profile & Settings">
      {isLoading && <LoadingOverlay />}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Header Card */}
        <div className="rounded-2xl border border-sand bg-white p-6 shadow-xs md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) await handleUploadImage(file);
                  event.target.value = "";
                }}
              />
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#C99E4A] bg-lilac shadow-sm sm:h-24 sm:w-24">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.fullName || "User Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                    {initials}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
                  {user.fullName || "Chartered Member"}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active Member
                  </span>
                  {user.officialDesignation && (
                    <span className="text-xs text-text/70">
                      • {user.officialDesignation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="self-start rounded-xl sm:self-auto"
            >
              Update Photo
            </Button>
          </div>
        </div>

        {/* Read-Only Account Summary Card */}
        <div className="rounded-2xl border border-sand bg-white p-6 shadow-xs md:p-8">
          <h3 className="mb-2 text-base font-bold text-primary">
            Account Information
          </h3>
          <dl className="divide-y divide-sand">
            <ReadonlyRow label="Registration Date" value={registrationDate} />
            <ReadonlyRow label="Primary Email" value={user.email || "N/A"} />
            <ReadonlyRow
              label="Contact Phone"
              value={user.phoneNumber || formik.values.phone || "N/A"}
            />
          </dl>
        </div>

        {/* Profile Edit Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-8 rounded-2xl border border-sand bg-white p-6 shadow-xs md:p-8"
        >
          {/* Section 1: Personal Details */}
          <div>
            <h3 className="text-base font-bold text-primary">
              Personal Information
            </h3>
            <p className="mt-0.5 text-xs text-text/60">
              Update your primary identification and contact coordinates.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                error={formik.errors.firstName}
                touched={formik.touched.firstName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                error={formik.errors.lastName}
                touched={formik.touched.lastName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <TextField
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
              <TextField
                name="address"
                label="Street Address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              <TextField
                name="country"
                label="Country"
                value={formik.values.country}
                onChange={formik.handleChange}
              />
              <TextField
                name="stateProvince"
                label="State / Province"
                value={formik.values.stateProvince}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Section 2: Professional & Qualifications */}
          <div className="border-t border-sand pt-6">
            <h3 className="text-base font-bold text-primary">
              Professional & Qualifications
            </h3>
            <p className="mt-0.5 text-xs text-text/60">
              Information regarding your employment, career role, and
              credentialing.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                name="placeOfWork"
                label="Place of Work / Organization"
                value={formik.values.placeOfWork}
                onChange={formik.handleChange}
              />
              <TextField
                name="officialDesignation"
                label="Official Designation / Job Title"
                value={formik.values.officialDesignation}
                onChange={formik.handleChange}
              />
              <div className="sm:col-span-2">
                <TextField
                  name="currentEducationOrProfessionalQualification"
                  label="Highest Educational or Professional Qualification"
                  value={
                    formik.values.currentEducationOrProfessionalQualification
                  }
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Social & Online Links */}
          <div className="border-t border-sand pt-6">
            <h3 className="text-base font-bold text-primary">
              Professional & Social Links
            </h3>
            <p className="mt-0.5 text-xs text-text/60">
              Connect your verified social media and professional networks.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextField
                name="linkedinUrl"
                label="LinkedIn Profile URL"
                value={formik.values.linkedinUrl}
                onChange={formik.handleChange}
              />
              <TextField
                name="twitterUrl"
                label="Twitter / X Profile URL"
                value={formik.values.twitterUrl}
                onChange={formik.handleChange}
              />
              <TextField
                name="facebookUrl"
                label="Facebook Profile URL"
                value={formik.values.facebookUrl}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Section 4: Bio */}
          <div className="border-t border-sand pt-6">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text/70">
              Professional Biography
            </label>
            <p className="mb-3 text-xs text-text/60">
              A brief summary of your background, areas of expertise, and loss
              prevention interests.
            </p>
            <textarea
              name="bio"
              rows={4}
              value={formik.values.bio}
              onChange={formik.handleChange}
              placeholder="Tell us about your professional background and experience..."
              className="w-full rounded-xl border border-sand px-4 py-3 text-sm text-text focus:border-primary/40 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isLoading}
              className="rounded-xl px-8"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

function ReadonlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-3 sm:items-center">
      <dt className="text-xs font-semibold uppercase tracking-wider text-text/50">
        {label}
      </dt>
      <dd className="text-sm font-medium text-text sm:col-span-2">{value}</dd>
    </div>
  );
}

export default SettingsPage;
