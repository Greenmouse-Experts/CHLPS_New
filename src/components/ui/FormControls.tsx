"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/tokens";
import { FieldError, FieldHint } from "./TextField";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: React.ReactNode;
  hint?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, hint, error, size = "md", indeterminate, className, id, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const checkboxId =
      id ||
      (typeof label === "string"
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    const sizeStyles = {
      sm: { box: "w-3.5 h-3.5 rounded", label: "text-xs", gap: "gap-1.5" },
      md: { box: "w-4 h-4 rounded", label: "text-sm", gap: "gap-2" },
      lg: { box: "w-5 h-5 rounded-md", label: "text-base", gap: "gap-2.5" },
    }[size];

    return (
      <div className="flex flex-col gap-1">
        <label className={cn("group flex cursor-pointer items-start", sizeStyles.gap)}>
          <div className="relative mt-0.5 shrink-0">
            <input
              ref={(element) => {
                inputRef.current = element;
                if (typeof ref === "function") ref(element);
                else if (ref) ref.current = element;
              }}
              id={checkboxId}
              type="checkbox"
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "flex items-center justify-center border-2 transition-all duration-150",
                sizeStyles.box,
                error
                  ? "border-[#E84D52] peer-checked:border-[#E84D52] peer-checked:bg-[#E84D52]"
                  : "border-sand peer-checked:border-primary peer-checked:bg-primary",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-1",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                props.checked || indeterminate
                  ? error
                    ? "border-[#E84D52] bg-[#E84D52]"
                    : "border-primary bg-primary"
                  : "bg-white",
                className,
              )}
            >
              {(props.checked || props.defaultChecked) && !indeterminate && (
                <svg viewBox="0 0 10 8" fill="none" className="w-[55%] text-white">
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {indeterminate && (
                <div className="h-[1.5px] w-[55%] rounded-full bg-white" />
              )}
            </div>
          </div>

          {label && (
            <span className={cn("font-medium text-text/80", sizeStyles.label)}>
              {label}
            </span>
          )}
        </label>

        {hint && !error && <FieldHint>{hint}</FieldHint>}
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
