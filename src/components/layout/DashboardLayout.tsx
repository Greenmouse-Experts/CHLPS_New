"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  ChartHistogramIcon,
  DashboardSquare01Icon,
  Logout01Icon,
  Menu01Icon,
  Notification01Icon,
  Setting07Icon,
  SidebarLeft01Icon,
  ShoppingBag01Icon,
  CustomerSupportIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/tokens";
import { ConfirmModal } from "@/components/ui";
import { Assets } from "@/lib/assets";
import { resetUser, UserState } from "@/features/auth/reducers/user_slice";
import { RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearUserFromDB } from "@/lib/storage/user_db";
import ApiService from "@/lib/network/api";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare01Icon} size={16} color="currentColor" />,
  },
  {
    label: "My Courses",
    href: "/dashboard/courses",
    icon: <HugeiconsIcon icon={BookOpen01Icon} size={16} color="currentColor" />,
  },
  {
    label: "Progress",
    href: "/dashboard/progress",
    icon: <HugeiconsIcon icon={ChartHistogramIcon} size={16} color="currentColor" />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <HugeiconsIcon icon={Notification01Icon} size={16} color="currentColor" />,
  },
  {
    label: "Purchase History",
    href: "/dashboard/purchase-history",
    icon: <HugeiconsIcon icon={ShoppingBag01Icon} size={16} color="currentColor" />,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: <HugeiconsIcon icon={CustomerSupportIcon} size={16} color="currentColor" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <HugeiconsIcon icon={Setting07Icon} size={16} color="currentColor" />,
  },
];

function NavItemRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-secondary text-primary"
          : "text-white hover:bg-white/10",
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="flex-1 text-[14px]">{item.label}</span>}
    </Link>
  );
}

function Sidebar({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogout() {
    await clearUserFromDB();
    ApiService.clearTokens();
    dispatch(resetUser());
    router.replace("/dashboard/sign-in");
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-primary transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "shrink-0 border-b border-white/10",
          collapsed
            ? "flex flex-col items-center gap-2 px-2 py-3"
            : "flex items-center gap-2 px-3 py-4",
        )}
      >
        <Link href="/" className={cn(collapsed ? "shrink-0" : "min-w-0 flex-1")}>
          <Image
            src={Assets.icons.logo}
            alt="CHLPS"
            width={collapsed ? 36 : 180}
            height={collapsed ? 36 : 48}
            className={cn(
              "object-contain",
              collapsed ? "h-9 w-auto" : "h-12 w-auto brightness-0 invert",
            )}
            priority
          />
        </Link>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <HugeiconsIcon icon={SidebarLeft01Icon} size={16} color="currentColor" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <NavItemRow key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-2 pt-2 pb-3">
        <button
          onClick={() => setLogoutOpen(true)}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
            "text-[#FF8A8A] transition-colors duration-150 hover:bg-white/10",
          )}
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" />
          {!collapsed && <span className="flex-1 text-left">Logout</span>}
        </button>
      </div>

      <ConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Log out"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        variant="danger"
      />
    </aside>
  );
}

function DashboardHeader({
  title,
  onMenuToggle,
  user,
}: {
  title?: string;
  onMenuToggle?: () => void;
  user: UserState;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-primary px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} size={18} color="currentColor" />
        </button>
        {title && (
          <span className="text-sm font-semibold tracking-wide text-white uppercase">
            {title}
          </span>
        )}
      </div>

      <Link href="/dashboard/settings" className="flex shrink-0 cursor-pointer items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-xs font-semibold text-white">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            (user.fullName || "M").trim().toUpperCase()[0]
          )}
        </div>
        <p className="hidden text-sm font-semibold tracking-wide text-white uppercase sm:block">
          {user.fullName || "Member"}
        </p>
      </Link>
    </header>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = NAV_ITEMS.find((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-cream">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="hidden shrink-0 md:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onToggle={() => setMobileOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader
          title={activeItem?.label}
          onMenuToggle={() => setMobileOpen(true)}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {title && (
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
      )}
      {children}
    </div>
  );
}
