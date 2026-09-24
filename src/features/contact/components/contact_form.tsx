"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

const CONTACT_EMAIL = "info@chlpscanada.ca";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof typeof initialValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const fullName =
      `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    const subject = `Inquiry: ${values.interest} (${fullName || "Prospective Student"})`;
    const body = [
      `First Name: ${values.firstName.trim()}`,
      `Last Name: ${values.lastName.trim()}`,
      `Email: ${values.email.trim()}`,
      values.phone.trim() ? `Phone: ${values.phone.trim()}` : null,
      `Interested In: ${values.interest}`,
      "",
      "Message:",
      values.message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    toast.success("Opening your email client to send this message.");
    setIsSubmitting(false);
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
            className="input input-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
            Email
          </label>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
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
            className="input input-bordered h-12 w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
          />
        </div>
      </div>

      {/* Row 3: Interested In */}
      <div className="">
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
      <div className="">
        <label className="label-text mb-1.5 block text-xs font-semibold text-base-content/80">
          Message
        </label>
        <textarea
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className="textarea textarea-bordered min-h-[140px] w-full rounded-xl border-base-300 bg-white text-sm focus:border-[#0D154B] focus:outline-none"
        />
      </div>

      {/* Row 5: Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl border-none bg-[#181858] text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-[#0D154B] active:scale-[0.99] disabled:opacity-75 normal-case"
      >
        <span>Send Message</span>
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          size={18}
          color="currentColor"
          strokeWidth={2.2}
        />
      </button>
    </form>
  );
}
