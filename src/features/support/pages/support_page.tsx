"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CallIcon,
  CustomerSupportIcon,
  Mail01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components";
import { Button, Modal, TextField } from "@/components/ui";
import { RootState } from "@/lib/store/store";
import { useSupport } from "../domain/data/hooks/support_hooks";

const SupportPage = () => {
  const { faqs, isLoading, sending, sendMessage } = useSupport();
  const user = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user.fullName || "",
      email: user.email || "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async (values, helpers) => {
      const success = await sendMessage(values);
      if (success) {
        helpers.resetForm();
        setOpen(false);
      }
    },
  });

  return (
    <DashboardLayout title="Support">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
            <HugeiconsIcon icon={CustomerSupportIcon} size={24} color="currentColor" />
          </span>
          <p className="text-text/55">
            Need a hand? Reach out and our team will get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <a
            href="mailto:info@chlpscanada.ca"
            className="flex flex-col gap-3 rounded-xl border border-sand bg-white p-6 hover:border-secondary"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-lilac text-primary">
              <HugeiconsIcon icon={Mail01Icon} size={20} color="currentColor" />
            </span>
            <p className="text-sm text-text/55">Email us</p>
            <p className="font-medium text-primary">info@chlpscanada.ca</p>
          </a>
          <a
            href="tel:+14375451684"
            className="flex flex-col gap-3 rounded-xl border border-sand bg-white p-6 hover:border-secondary"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-lilac text-primary">
              <HugeiconsIcon icon={CallIcon} size={20} color="currentColor" />
            </span>
            <p className="text-sm text-text/55">Call us</p>
            <p className="font-medium text-primary">+1 437-545-1684</p>
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col gap-3 rounded-xl border border-sand bg-white p-6 text-left hover:border-secondary"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-lilac text-primary">
              <HugeiconsIcon icon={Message01Icon} size={20} color="currentColor" />
            </span>
            <p className="text-sm text-text/55">Send a message</p>
            <p className="font-medium text-primary">We'll reply by email</p>
          </button>
        </div>

        <div className="rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-primary uppercase">
            Frequently asked questions
          </h2>
          {isLoading ? (
            <p className="py-6 text-center text-text/50">Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p className="py-6 text-center text-text/50">No FAQs available yet.</p>
          ) : (
            <div className="divide-y divide-sand">
              {faqs.map((faq) => (
                <details key={faq.id} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-primary">
                    {faq.question}
                    <span className="text-text/40 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-text/60">{faq.answer}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Send a message">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextField
            name="name"
            label="Name"
            value={formik.values.name}
            error={formik.errors.name}
            touched={formik.touched.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            error={formik.errors.email}
            touched={formik.touched.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.12em] text-text/55">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              value={formik.values.message}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="How can we help?"
              className="w-full rounded-lg border border-sand p-3 text-text placeholder:text-text/40 focus:border-primary/40 focus:outline-none"
            />
            {formik.touched.message && formik.errors.message && (
              <p className="mt-1 text-xs text-[#E84D52]">{formik.errors.message}</p>
            )}
          </div>
          <Button type="submit" fullWidth loading={sending}>
            Send message
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default SupportPage;
