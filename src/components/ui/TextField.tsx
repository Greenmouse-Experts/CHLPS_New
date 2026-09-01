"use client";

import React, { useState } from "react";
import { cn } from "@/lib/tokens";

interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  hint?: string;
  error?: string;
  touched?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium uppercase tracking-[0.12em] text-text/55"
    >
      {children}
      {required && <span className="ml-0.5 text-[#E84D52]">*</span>}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-text/55">{children}</p>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-[#E84D52]">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <circle cx="6" cy="6" r="5.5" stroke="#E84D52" />
        <path
          d="M6 3.5v3M6 8h.01"
          stroke="#E84D52"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </p>
  );
}

const sizeMap = {
  sm: { input: "h-8 text-xs px-2.5", icon: "w-8" },
  md: { input: "h-10 text-sm px-3", icon: "w-10" },
  lg: { input: "h-11 text-base px-3.5", icon: "w-11" },
};

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      hint,
      error,
      touched,
      leftIcon,
      rightIcon,
      rightAction,
      size = "md",
      fullWidth = true,
      clearable = false,
      onClear,
      className,
      id,
      required,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error && (touched === undefined ? true : touched);
    const sizes = sizeMap[size];
    const showClear = clearable && value !== undefined && value !== "";

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <FieldLabel htmlFor={inputId} required={required}>
            {label}
          </FieldLabel>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className={cn(
                "pointer-events-none absolute left-0 flex h-full items-center justify-center text-text/50",
                sizes.icon,
              )}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            required={required}
            className={cn(
              "w-full rounded-lg border bg-white text-text placeholder:text-text/40",
              "transition-colors duration-150 focus:outline-none",
              hasError
                ? "border-[#E84D52] focus:border-[#E84D52]"
                : "border-sand focus:border-primary/40",
              "disabled:cursor-not-allowed disabled:bg-cream disabled:opacity-50",
              sizes.input,
              leftIcon
                ? size === "sm"
                  ? "pl-7"
                  : size === "lg"
                    ? "pl-10"
                    : "pl-9"
                : undefined,
              rightIcon || rightAction || showClear
                ? size === "sm"
                  ? "pr-7"
                  : size === "lg"
                    ? "pr-10"
                    : "pr-9"
                : undefined,
              className,
            )}
            {...props}
          />

          <span
            className={cn(
              "absolute right-0 flex h-full items-center justify-center",
              sizes.icon,
            )}
          >
            {showClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-text/50 transition-colors hover:text-text"
                tabIndex={-1}
                aria-label="Clear"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            {!showClear && rightAction && rightAction}
            {!showClear && !rightAction && rightIcon && (
              <span className="pointer-events-none text-text/50">{rightIcon}</span>
            )}
          </span>
        </div>

        {hint && !hasError && <FieldHint>{hint}</FieldHint>}
        {hasError && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);

TextField.displayName = "TextField";

interface PasswordFieldProps extends Omit<
  TextFieldProps,
  "type" | "rightIcon" | "rightAction"
> {}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);

    const EyeIcon = () => (
      <button
        type="button"
        onClick={() => setShow((value) => !value)}
        className="text-text/50 transition-colors hover:text-text"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 2l12 12M6.5 6.6A2 2 0 0110 9.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M4.2 4.3C2.6 5.3 1.3 6.8 1 8c.8 3 3.8 5 7 5 1.4 0 2.7-.4 3.8-1.1"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M8 3C11.2 3 14.2 5 15 8c-.2.7-.6 1.4-1.1 2"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M1 8C2 5 4.7 3 8 3s6 2 7 5c-1 3-3.7 5-7 5S2 11 1 8z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        )}
      </button>
    );

    return (
      <TextField
        ref={ref}
        type={show ? "text" : "password"}
        rightAction={<EyeIcon />}
        {...props}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";

export {
  TextField,
  PasswordField,
  FieldLabel,
  FieldError,
  FieldHint,
};
export type { TextFieldProps };
