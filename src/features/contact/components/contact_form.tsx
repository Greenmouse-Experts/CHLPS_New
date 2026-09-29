"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import simpleApiClient from "@/lib/network/simpleApi";
import { ApiUrls } from "@/lib/network/api_url";

export interface ContactFormPayload {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  interestedIn: string;
  message: string;
}

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  interest: "Student Membership",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);

  const contactMutation = useMutation({
    mutationFn: async (payload: ContactFormPayload) => {
      const response = await simpleApiClient.post(ApiUrls.contactMe, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      );
      setValues(initialValues);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send your message. Please try again or reach out directly.";
      toast.error(msg);
    },
  });

  function update(field: keyof typeof initialValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (
      !values.firstName.trim() ||
      !values.lastName.trim() ||
      !values.email.trim() ||
      !values.message.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    contactMutation.mutate({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      interest: values.interest,
      interestedIn: values.interest,
      message: values.message.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Row 1: First Name & Last Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
            First Name
          </label>
          <input
            type="text"
            required
            value={values.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="e.g. Alexander"
            className="input input-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
          />
        </div>

        <div>
          <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
            Last Name
          </label>
          <input
            type="text"
            required
            value={values.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="e.g. Vance"
            className="input input-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
            Email
          </label>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="e.g. alexander@example.com"
            className="input input-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
          />
        </div>

        <div>
          <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
            Phone
          </label>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g. +1 (416) 555-0199"
            className="input input-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
          />
        </div>
      </div>

      {/* Row 3: Interested In */}
      <div className="mt-4">
        <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
          Interested In
        </label>
        <select
          value={values.interest}
          onChange={(e) => update("interest", e.target.value)}
          className="select select-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm font-normal focus:border-[#0D154B] focus:outline-none"
        >
          <option value="Student Membership">Student Membership</option>
          <option value="Professional Certification (CLPA, BCLP, CLPO)">
            Professional Certification (CLPA, BCLP, CLPO)
          </option>
          <option value="Executive / Chartered Designation (ChLPS)">
            Executive / Chartered Designation (ChLPS)
          </option>
          <option value="Corporate Partnership">Corporate Partnership</option>
          <option value="General Inquiry">General Inquiry</option>
        </select>
      </div>

      {/* Row 4: Message */}
      <div className="mt-4">
        <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
          Message
        </label>
        <textarea
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="How can we assist you today?"
          className="textarea textarea-bordered min-h-[140px] w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
        />
      </div>

      {/* Row 5: Submit Button */}
      <button
        type="submit"
        disabled={contactMutation.isPending}
        className="btn mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl border-none bg-[#181858] text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-[#0D154B] active:scale-[0.99] disabled:opacity-75 normal-case"
      >
        {contactMutation.isPending ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={18}
              color="currentColor"
              strokeWidth={2.2}
            />
          </>
        )}
      </button>
    </form>
  );
}
