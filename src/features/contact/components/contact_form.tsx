"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

const CONTACT_EMAIL = "info@chlpscanada.ca";

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const fieldClass =
  "h-10 w-full rounded-[8px] border border-[#E1DCF2] bg-white px-3 text-[13px] text-text outline-none transition-colors duration-150 placeholder:text-[#A3A1B0] focus:border-primary/40";

const labelClass = "mb-1.5 block text-[12.5px] font-medium text-[#4A4958]";

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);

  function update(field: keyof typeof initialValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const subject = values.subject.trim() || "Website enquiry";
    const body = [
      `Name: ${values.fullName.trim()}`,
      `Email: ${values.email.trim()}`,
      values.phone.trim() ? `Phone: ${values.phone.trim()}` : null,
      "",
      values.message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    toast.success("Opening your email app to send this enquiry.");
  }

  return (
    <div className="rounded-[14px] bg-lilac p-5 sm:p-7">
      <h2 className="text-[1.125rem] font-semibold tracking-tight text-[#0A1542] sm:text-[1.25rem]">
        Send us a message
      </h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[#6F6E7A] sm:text-[13px]">
        Complete the form and a member of the ChLPS Canada team will respond to
        your enquiry.
      </p>

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-full-name" className={labelClass}>
              Full name
            </label>
            <input
              id="contact-full-name"
              required
              value={values.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              placeholder="Your full name"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email address
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="name@example.com"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone number
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder="Optional"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              Subject
            </label>
            <input
              id="contact-subject"
              value={values.subject}
              onChange={(event) => update("subject", event.target.value)}
              placeholder="How can we help?"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder="Write your message here"
            className="w-full resize-y rounded-[8px] border border-[#E1DCF2] bg-white px-3 py-2.5 text-[13px] leading-relaxed text-text outline-none transition-colors duration-150 placeholder:text-[#A3A1B0] focus:border-primary/40"
          />
        </div>

        <button
          type="submit"
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#141160] text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
        >
          Send Message
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={16}
            color="currentColor"
            strokeWidth={2.2}
          />
        </button>
      </form>
    </div>
  );
}
