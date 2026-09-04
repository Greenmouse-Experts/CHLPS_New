"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Assets } from "@/lib/assets";
import PageContainer from "@/features/components/page_container";
import { RootState } from "@/lib/store/store";

type NavLinkItem = {
  label: string;
  href: string;
};

type MegaMenu = {
  type: "mega";
  heading: string;
  description: string;
  cta: NavLinkItem;
  columns: NavLinkItem[][];
};

type CompactMenu = {
  type: "compact";
  items: NavLinkItem[];
};

type NavItem = {
  label: string;
  href: string;
  menu?: MegaMenu | CompactMenu;
};

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Membership",
    href: "#membership",
    menu: {
      type: "mega",
      heading: "Membership",
      description:
        "Choose the membership level that reflects your current stage, experience and professional responsibility.",
      cta: { label: "Explore Membership", href: "#membership" },
      columns: [
        [
          { label: "Student Membership", href: "#membership-student" },
          { label: "Affiliate Membership", href: "#membership-affiliate" },
          { label: "Licentiate Membership", href: "#membership-licentiate" },
        ],
        [
          { label: "Associate Membership", href: "#membership-associate" },
          { label: "Certified Membership", href: "#membership-certified" },
          { label: "Corporate Membership", href: "#membership-corporate" },
        ],
      ],
    },
  },
  {
    label: "Certifications",
    href: "#certification",
    menu: {
      type: "mega",
      heading: "Certification",
      description:
        "Progress from foundational loss prevention learning to advanced professional and chartered recognition.",
      cta: { label: "Explore Certifications", href: "#certification" },
      columns: [
        [
          {
            label: "Basic Professional Certificate in Loss Prevention",
            href: "#certification-bclp",
          },
          {
            label: "Certified Loss Prevention Associate™ (CLPA™)",
            href: "#certification-clpa",
          },
          {
            label: "Certified Loss Prevention Officer™ (CLPO™)",
            href: "#certification-clpo",
          },
        ],
        [
          {
            label: "Certified Loss Prevention Manager™ (CLPM™)",
            href: "#certification-clpm",
          },
          {
            label: "Advanced Professional Certificate in Loss Prevention Management",
            href: "#certification-aclpm",
          },
          {
            label: "Chartered Loss Prevention Specialist™ (ChLPS™)",
            href: "#certification-chlps",
          },
        ],
      ],
    },
  },
  {
    label: "About Us",
    href: "#about",
    menu: {
      type: "compact",
      items: [
        { label: "Our History", href: "#about" },
        { label: "Our Governance", href: "#values" },
      ],
    },
  },
  { label: "Events", href: "#events" },
  { label: "News & Blogs", href: "#news" },
  { label: "Careers Centre", href: "#careers" },
  { label: "Contact Us", href: "#contact" },
];

function GoldTriangle() {
  return (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path d="M8 5 0 9.5v-9L8 5Z" fill="#CDA54E" />
    </svg>
  );
}

function MegaLink({
  item,
  onNavigate,
}: {
  item: NavLinkItem;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="block border-b border-[#E4E2EC] last:border-b-0"
    >
      <span className="nav-option-chip -mx-2 flex items-center gap-3 rounded-full px-3 py-[0.85rem] text-[15px] font-semibold leading-snug text-primary transition-colors duration-150">
        <GoldTriangle />
        <span>{item.label}</span>
      </span>
    </Link>
  );
}

function MegaPanel({
  menu,
  onNavigate,
}: {
  menu: MegaMenu;
  onNavigate?: () => void;
}) {
  return (
    <div className="nav-mega">
      <PageContainer>
        <div className="flex items-stretch gap-0 py-10">
          <div className="flex w-[17.5rem] shrink-0 flex-col pr-8 lg:w-[19.5rem] lg:pr-12">
            <h3 className="text-[20px] font-medium leading-tight tracking-tight text-primary">
              {menu.heading}
            </h3>
            <p className="mt-3 max-w-[16.5rem] text-[14px] leading-relaxed text-[#6E6B78]">
              {menu.description}
            </p>
            <Link
              href={menu.cta.href}
              onClick={onNavigate}
              className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              {menu.cta.label}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                color="currentColor"
                strokeWidth={2.2}
              />
            </Link>
          </div>

          <div className="my-2 w-px shrink-0 self-stretch bg-[#E4E2EC]" />

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-10 pl-8 lg:gap-x-16 lg:pl-12">
            {menu.columns.map((column, index) => (
              <div key={index} className="flex flex-col">
                {column.map((item) => (
                  <MegaLink
                    key={item.label}
                    item={item}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

function CompactPanel({
  menu,
  onNavigate,
}: {
  menu: CompactMenu;
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-[15.5rem] bg-white py-3.5 shadow-[0_14px_40px_rgba(33,26,115,0.12)]">
      <div className="flex flex-col gap-1 px-3">
        {menu.items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="nav-option-chip flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-[15px] font-semibold text-primary"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavLink({
  item,
  open,
  onOpen,
  onClose,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNavigate?: () => void;
}) {
  if (!item.menu) {
    return (
      <Link
        href={item.href}
        onMouseEnter={onClose}
        onFocus={onClose}
        onClick={onNavigate}
        className="text-[18px] font-semibold whitespace-nowrap text-[#302D39] transition-colors duration-200 hover:text-primary"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onFocus={onOpen}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative flex items-center gap-0.5 text-[18px] font-semibold whitespace-nowrap text-[#302D39] transition-colors duration-200 hover:text-primary ${
          open ? "text-primary" : ""
        }`}
      >
        <span className="relative">
          {item.label}
          <span
            className={`absolute inset-x-0 -bottom-1 h-[2px] bg-secondary transition-opacity duration-150 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
        <span
          className={`inline-flex transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            color="currentColor"
          />
        </span>
      </Link>

      {item.menu.type === "compact" ? (
        <div
          className={`absolute left-0 top-full z-50 pt-3 transition-opacity duration-150 ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <CompactPanel menu={item.menu} onNavigate={onNavigate} />
        </div>
      ) : null}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const isLoggedIn = Boolean(token);

  const openMega = navLinks.find(
    (item) => item.label === openMenu && item.menu?.type === "mega",
  );

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function open(label: string) {
    cancelClose();
    setOpenMenu(label);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }

  function closeAll() {
    cancelClose();
    setOpenMenu(null);
    setMobileOpen(false);
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const menu = new URLSearchParams(window.location.search).get("menu");
    if (menu) setOpenMenu(menu);
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => cancelClose();
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-cream"
      onMouseLeave={scheduleClose}
    >
      <PageContainer>
        <div className="header-bar py-4 lg:py-5">
          <Link href="/" className="shrink-0">
            <Image
              src={Assets.icons.logo}
              alt="Association of Chartered Loss Prevention Specialists of Canada"
              width={260}
              height={68}
              className="h-auto w-44 md:w-56"
              priority
            />
          </Link>

          <div className="header-right">
            <div className="header-actions">
              <form
                onSubmit={handleSearch}
                className="header-search overflow-hidden rounded-full border border-sand bg-white"
              >
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search site"
                  aria-label="Search site"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-text outline-none placeholder:text-text/45"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-full w-9 shrink-0 items-center justify-center rounded-r-full bg-primary text-white transition-colors duration-200 hover:bg-accent"
                >
                  <HugeiconsIcon icon={Search01Icon} size={16} color="currentColor" />
                </button>
              </form>

              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-secondary px-4 text-[13px] font-semibold text-primary transition-all duration-200 hover:brightness-95"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard/sign-in"
                    className="inline-flex h-9 items-center whitespace-nowrap rounded-full border border-primary px-4 text-[13px] font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                  >
                    My ChLPS
                  </Link>
                  <Link
                    href="/dashboard/register"
                    className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-secondary px-4 text-[13px] font-semibold text-primary transition-all duration-200 hover:brightness-95"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <nav className="header-nav flex-row flex-nowrap items-center gap-5">
              {navLinks.map((item) => (
                <div key={item.label}>
                  <NavLink
                    item={item}
                    open={openMenu === item.label}
                    onOpen={() => open(item.label)}
                    onClose={scheduleClose}
                    onNavigate={closeAll}
                  />
                </div>
              ))}
            </nav>

            <button
              className="header-menu-btn p-1 text-primary"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <HugeiconsIcon
                icon={mobileOpen ? Cancel01Icon : Menu01Icon}
                size={22}
                color="currentColor"
              />
            </button>
          </div>
        </div>
      </PageContainer>

      <div
        className={`header-mega absolute inset-x-0 top-full z-50 origin-top ${
          openMega
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onMouseEnter={cancelClose}
      >
        {openMega?.menu?.type === "mega" ? (
          <MegaPanel menu={openMega.menu} onNavigate={closeAll} />
        ) : null}
      </div>

      <div
        className={`header-mobile-drawer transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <PageContainer className="pb-5">
            <div className="flex flex-col gap-4 border-t border-sand pt-4">
              {navLinks.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.menu) {
                        e.preventDefault();
                        setOpenMenu((prev) =>
                          prev === item.label ? null : item.label,
                        );
                        return;
                      }
                      closeAll();
                    }}
                    className="text-sm font-medium text-text hover:text-primary"
                  >
                    {item.label}
                  </Link>
                  {item.menu && openMenu === item.label ? (
                    item.menu.type === "mega" ? (
                      <div className="flex flex-col pl-1">
                        {item.menu.columns.flat().map((child) => (
                          <MegaLink
                            key={child.label}
                            item={child}
                            onNavigate={closeAll}
                          />
                        ))}
                      </div>
                    ) : (
                      <CompactPanel menu={item.menu} onNavigate={closeAll} />
                    )
                  ) : null}
                </div>
              ))}

              <form
                onSubmit={handleSearch}
                className="mt-2 flex h-10 items-stretch overflow-hidden rounded-full border border-sand bg-white md:hidden"
              >
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search site"
                  aria-label="Search site"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-text outline-none placeholder:text-text/45"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-full w-10 shrink-0 items-center justify-center rounded-r-full bg-primary text-white"
                >
                  <HugeiconsIcon icon={Search01Icon} size={16} color="currentColor" />
                </button>
              </form>

              <div className="flex flex-row flex-nowrap gap-2 md:hidden">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={closeAll}
                    className="flex h-10 items-center justify-center rounded-full bg-secondary px-4 text-sm font-semibold text-primary"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard/sign-in"
                      onClick={closeAll}
                      className="flex h-10 items-center justify-center rounded-full border border-primary px-4 text-sm font-semibold text-primary"
                    >
                      My ChLPS
                    </Link>
                    <Link
                      href="/dashboard/register"
                      onClick={closeAll}
                      className="flex h-10 items-center justify-center rounded-full bg-secondary px-4 text-sm font-semibold text-primary"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
    </header>
  );
}
