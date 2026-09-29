"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/tokens";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number | string;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export type TabVariant = "pills" | "underline" | "segmented" | "cards";

export interface UrlTabberProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  paramKey?: string;
  variant?: TabVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  onChange?: (tabId: string) => void;
  scroll?: boolean;
}

/**
 * Hook to read and write the active tab from/to the URL query parameters.
 */
export function useUrlTab(defaultTab?: string, paramKey: string = "tab") {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get(paramKey) || defaultTab || "";

  const setTab = (nextTab: string, scroll: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, nextTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll });
  };

  return [activeTab, setTab] as const;
}

function UrlTabberContent({
  tabs,
  activeTab,
  defaultTab,
  paramKey = "tab",
  variant = "segmented",
  size = "md",
  className,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  onChange,
  scroll = false,
}: UrlTabberProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTabId =
    activeTab || searchParams.get(paramKey) || defaultTab || tabs[0]?.id;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled || tabId === activeTabId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll });
    onChange?.(tabId);
  };

  const getVariantContainerClasses = () => {
    switch (variant) {
      case "pills":
        return "flex flex-wrap items-center gap-2";
      case "underline":
        return "flex items-center gap-6 border-b border-base-200/80 overflow-x-auto";
      case "cards":
        return "grid grid-cols-2 gap-3 w-full sm:w-auto";
      case "segmented":
      default:
        return "inline-flex items-center gap-1.5 rounded-2xl bg-base-200/70 p-1.5 backdrop-blur-xs border border-base-300/40";
    }
  };

  const getTabClasses = (isActive: boolean, disabled?: boolean) => {
    if (disabled) {
      return "opacity-40 cursor-not-allowed";
    }

    switch (variant) {
      case "pills":
        return isActive
          ? cn(
              "btn btn-sm rounded-xl font-semibold bg-[#0D154B] text-white hover:bg-[#0D154B] border-none shadow-xs normal-case",
              activeTabClassName,
            )
          : cn(
              "btn btn-sm btn-ghost rounded-xl font-medium text-base-content/70 hover:bg-base-200 normal-case",
              inactiveTabClassName,
            );

      case "underline":
        return isActive
          ? cn(
              "flex items-center gap-2 pb-3 -mb-px border-b-2 border-[#CDA54E] font-bold text-[#0D154B] text-sm transition-colors",
              activeTabClassName,
            )
          : cn(
              "flex items-center gap-2 pb-3 -mb-px border-b-2 border-transparent font-medium text-base-content/60 hover:text-[#0D154B] text-sm transition-colors",
              inactiveTabClassName,
            );

      case "cards":
        return isActive
          ? cn(
              "flex items-center justify-center gap-2.5 rounded-2xl border-2 border-[#CDA54E] bg-white p-3.5 font-bold text-[#0D154B] shadow-sm transition-all",
              activeTabClassName,
            )
          : cn(
              "flex items-center justify-center gap-2.5 rounded-2xl border border-base-200 bg-base-100/50 p-3.5 font-semibold text-base-content/70 hover:bg-white transition-all",
              inactiveTabClassName,
            );

      case "segmented":
      default:
        return isActive
          ? cn(
              "inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#0D154B] shadow-sm transition-all duration-200",
              activeTabClassName,
            )
          : cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-base-content/70 hover:bg-white/60 hover:text-[#0D154B] transition-all duration-200",
              inactiveTabClassName,
            );
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Page navigation tabs"
      className={cn(getVariantContainerClasses(), className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            type="button"
            onClick={() => handleTabClick(tab.id, tab.disabled)}
            className={cn(
              "cursor-pointer outline-hidden transition-all",
              getTabClasses(isActive, tab.disabled),
              tabClassName,
            )}
          >
            {tab.icon && (
              <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span
                className={cn(
                  "badge badge-sm rounded-lg px-1.5 py-0.5 text-[11px] font-bold",
                  isActive
                    ? variant === "pills"
                      ? "bg-white/20 text-white"
                      : "bg-[#0D154B]/10 text-[#0D154B]"
                    : "bg-base-200 text-base-content/70",
                )}
              >
                {tab.count}
              </span>
            )}

            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Reusable URL Tabber Component.
 * Synchronizes selected tab with URL query parameters for bookmarkable and shareable tabs.
 */
export function UrlTabber(props: UrlTabberProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-2xl bg-base-200/50 p-1.5",
            props.className,
          )}
        >
          {props.tabs.map((tab) => (
            <div
              key={tab.id}
              className="h-8 w-24 animate-pulse rounded-xl bg-base-300/60"
            />
          ))}
        </div>
      }
    >
      <UrlTabberContent {...props} />
    </Suspense>
  );
}

export default UrlTabber;
