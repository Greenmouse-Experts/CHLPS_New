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
      address: user.address || "",
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
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "M";

  return (
    <DashboardLayout title="My Profile">
      {isLoading && <LoadingOverlay />}
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-sand bg-white p-6 md:p-8">
          <div className="flex items-center gap-6">
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
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-sand bg-lilac">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold tracking-wide text-primary uppercase">
                {user.fullName || "Member"}
              </h2>
              <span className="flex items-center gap-2 text-sm font-medium text-[#166534]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#38CB89]" />
                Active
              </span>
              <Button size="sm" onClick={() => inputRef.current?.click()}>
                Update photo
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sand bg-white p-6 md:p-8">
          <dl className="divide-y divide-sand">
            <ReadonlyRow label="Registration date" value={registrationDate} />
            <ReadonlyRow label="Email" value={user.email || "N/A"} />
            <ReadonlyRow label="Phone number" value={user.phoneNumber || "N/A"} />
          </dl>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 rounded-xl border border-sand bg-white p-6 md:p-8"
        >
          <h2 className="text-lg font-semibold text-primary">Edit profile</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              name="firstName"
              label="First name"
              value={formik.values.firstName}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <TextField
              name="lastName"
              label="Last name"
              value={formik.values.lastName}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </div>
          <TextField
            name="address"
            label="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              name="facebookUrl"
              label="Facebook link"
              value={formik.values.facebookUrl}
              onChange={formik.handleChange}
            />
            <TextField
              name="twitterUrl"
              label="Twitter link"
              value={formik.values.twitterUrl}
              onChange={formik.handleChange}
            />
          </div>
          <TextField
            name="linkedinUrl"
            label="LinkedIn link"
            value={formik.values.linkedinUrl}
            onChange={formik.handleChange}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.12em] text-text/55">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formik.values.bio}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-sand px-4 py-3 text-text focus:border-primary/40 focus:outline-none"
            />
          </div>
          <Button type="submit" loading={isLoading}>
            Save changes
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

function ReadonlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:items-center">
      <dt className="text-sm font-medium text-text/50">{label}</dt>
      <dd className="text-text sm:col-span-2">{value}</dd>
    </div>
  );
}

export default SettingsPage;
