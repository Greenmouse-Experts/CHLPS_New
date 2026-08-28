"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Assets } from "@/lib/assets";
import PageContainer from "@/features/components/page_container";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Membership",
    href: "#membership",
    children: [
      { label: "Become a member", href: "#membership" },
      { label: "Member benefits", href: "#membership" },
    ],
  },
  {
    label: "Certification",
    href: "#certification",
    children: [
      { label: "Programs", href: "#programs" },
      { label: "Courses", href: "#courses" },
    ],
  },
  {
    label: "About",
    href: "#about",
    children: [
      { label: "Who we are", href: "#about" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  { label: "Events", href: "#events" },
  { label: "News & Blogs", href: "#news" },
  { label: "Careers Centre", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="text-text text-[13px] font-medium hover:text-primary transition-colors duration-200 whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={item.href}
        onClick={onNavigate}
        className="flex items-center gap-0.5 text-text text-[13px] font-medium hover:text-primary transition-colors duration-200 whitespace-nowrap"
      >
        {item.label}
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
      </Link>
      <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block z-50">
        <div className="min-w-44 rounded-lg bg-white border border-sand py-2 shadow-md">
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              onClick={onNavigate}
              className="block px-4 py-2 text-[13px] text-text hover:bg-lilac hover:text-primary transition-colors duration-150"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <header className="w-full bg-cream sticky top-0 z-50">
      <PageContainer>
        <div className="header-bar py-4 lg:py-5">
          <Link href="/" className="shrink-0">
            <Image
              src={Assets.icons.logo}
              alt="Association of Chartered Loss Prevention Specialists of Canada"
              width={260}
              height={68}
              className="w-44 md:w-56 h-auto"
              priority
            />
          </Link>

          <div className="header-right">
            <div className="header-actions">
              <form onSubmit={handleSearch} className="header-search">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search site"
                  aria-label="Search site"
                  className="flex-1 min-w-0 bg-white text-text text-sm placeholder:text-text/45 rounded-l-full px-4 outline-none border border-sand border-r-0"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="w-9 h-9 bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors duration-200"
                >
                  <HugeiconsIcon icon={Search01Icon} size={16} color="currentColor" />
                </button>
              </form>

              <Link
                href="#login"
                className="h-9 px-4 rounded-full border border-primary text-primary text-[13px] font-semibold inline-flex items-center hover:bg-primary hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                My ChLPS
              </Link>
              <Link
                href="#register"
                className="h-9 px-4 rounded-full bg-secondary text-primary text-[13px] font-semibold inline-flex items-center hover:brightness-95 transition-all duration-200 whitespace-nowrap"
              >
                Register
              </Link>
            </div>

            <nav className="flex flex-row flex-nowrap items-center gap-5">
              {navLinks.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </nav>
          </div>

          <button
            className="xl:hidden ml-auto text-primary p-1"
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
      </PageContainer>

      <div
        className={`xl:hidden grid transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <PageContainer className="pb-5">
            <div className="flex flex-col gap-4 border-t border-sand pt-4">
              {navLinks.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-text text-sm font-medium hover:text-primary"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="pl-3 text-[13px] text-text/70 hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}

              <form onSubmit={handleSearch} className="flex items-stretch h-10 mt-2">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search site"
                  aria-label="Search site"
                  className="flex-1 bg-white text-text text-sm placeholder:text-text/45 rounded-l-full px-4 outline-none border border-sand border-r-0"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="w-10 h-10 bg-primary text-white flex items-center justify-center"
                >
                  <HugeiconsIcon icon={Search01Icon} size={16} color="currentColor" />
                </button>
              </form>

              <div className="flex flex-row flex-nowrap gap-2">
                <Link
                  href="#login"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 px-4 rounded-full border border-primary text-primary text-sm font-semibold flex items-center justify-center"
                >
                  My ChLPS
                </Link>
                <Link
                  href="#register"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 px-4 rounded-full bg-secondary text-primary text-sm font-semibold flex items-center justify-center"
                >
                  Register
                </Link>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
    </header>
  );
}
