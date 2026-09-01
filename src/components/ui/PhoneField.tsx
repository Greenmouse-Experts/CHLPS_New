"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/tokens";
import { FieldError, FieldHint, FieldLabel } from "./TextField";

interface Country {
  code: string;
  dial: string;
  name: string;
  flag: string;
}

interface PhoneFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  touched?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  countryCode?: string;
  onCountryChange?: (country: Country) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  id?: string;
  className?: string;
}

export const COUNTRIES: Country[] = [
  { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", dial: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", dial: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { code: "IN", dial: "+91", name: "India", flag: "🇮🇳" },
  { code: "AE", dial: "+971", name: "UAE", flag: "🇦🇪" },
];

const sizeMap = {
  sm: { trigger: "h-8 text-xs", input: "h-8 text-xs" },
  md: { trigger: "h-10 text-sm", input: "h-10 text-sm" },
  lg: { trigger: "h-11 text-base", input: "h-11 text-base" },
};

const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      label,
      hint,
      error,
      touched,
      value = "",
      onChange,
      onBlur,
      name,
      countryCode = "CA",
      onCountryChange,
      disabled = false,
      required = false,
      placeholder = "Enter phone number",
      size = "md",
      fullWidth = true,
      id,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : "phone");
    const sizes = sizeMap[size];
    const selectedCountry =
      COUNTRIES.find((country) => country.code === countryCode) || COUNTRIES[0];
    const filtered = COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.dial.includes(search),
    );
    const hasError = !!error && (touched === undefined ? true : touched);

    useEffect(() => {
      function handler(event: MouseEvent) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full", className)}>
        {label && (
          <FieldLabel htmlFor={inputId} required={required}>
            {label}
          </FieldLabel>
        )}

        <div
          className={cn(
            "flex overflow-hidden rounded-lg border bg-white transition-colors duration-150",
            hasError
              ? "border-[#E84D52] focus-within:border-[#E84D52]"
              : "border-sand focus-within:border-primary/40",
            disabled && "cursor-not-allowed bg-cream opacity-50",
          )}
        >
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-r border-sand px-3 font-medium text-text",
                "transition-colors hover:bg-cream focus:outline-none",
                sizes.trigger,
              )}
            >
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dial}</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className={cn(
                  "text-text/50 transition-transform",
                  open && "rotate-180",
                )}
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute top-full left-0 z-50 mt-1 w-60 overflow-hidden rounded-lg border border-sand bg-white shadow-lg">
                <div className="border-b border-sand p-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search country..."
                    className="h-8 w-full rounded-md border border-sand bg-cream px-2.5 text-sm placeholder:text-text/45 focus:border-primary/40 focus:outline-none"
                    autoFocus
                  />
                </div>
                <ul className="max-h-48 overflow-y-auto py-1">
                  {filtered.length === 0 ? (
                    <li className="px-3 py-2 text-sm text-text/55">No results</li>
                  ) : (
                    filtered.map((country) => (
                      <li key={country.code}>
                        <button
                          type="button"
                          onClick={() => {
                            onCountryChange?.(country);
                            setOpen(false);
                            setSearch("");
                          }}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-cream",
                            country.code === selectedCountry.code && "bg-cream font-medium",
                          )}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="flex-1 truncate">{country.name}</span>
                          <span className="text-xs text-text/55">{country.dial}</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          <input
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              "flex-1 bg-transparent px-3 text-text placeholder:text-text/40 focus:outline-none",
              "disabled:cursor-not-allowed",
              sizes.input,
            )}
          />
        </div>

        {hint && !hasError && <FieldHint>{hint}</FieldHint>}
        {hasError && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);

PhoneField.displayName = "PhoneField";

export { PhoneField };
export type { PhoneFieldProps };
