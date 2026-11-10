"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { DEFAULT_SITE_SETTINGS } from "@/config/landing-cms";

export type LandingSectionId =
  | "beranda"
  | "tentang"
  | "rekrutmen"
  | "kontak"
  | "footer"
  | "karya";

interface PublicNavbarProps {
  activePage: "home" | "team";
  activeSection?: string;
  isScrolled?: boolean;
  shadowed?: boolean;
  brandName?: string;
  ctaLabel?: string;
  onNavigateSection?: (sectionId: LandingSectionId) => void;
}

export function PublicNavbar({
  activePage,
  activeSection = "beranda",
  isScrolled = false,
  shadowed = false,
  brandName = DEFAULT_SITE_SETTINGS.name,
  ctaLabel = DEFAULT_SITE_SETTINGS.navbarCtaLabel,
  onNavigateSection,
}: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleHomeNav = (sectionId: LandingSectionId) => {
    setMobileMenuOpen(false);
    onNavigateSection?.(sectionId);
  };

  const navBorderAndShadow = shadowed
    ? isScrolled
      ? "border border-zinc-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
      : "border border-zinc-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
    : isScrolled
    ? "border border-zinc-200/90"
    : "border border-white/70";

  const currentSection = activePage === "team" ? "team" : activeSection;

  const getDesktopLinkClass = (key: string) =>
    cn(
      "transition-colors cursor-pointer select-none",
      currentSection === key
        ? "text-[#185adb] font-bold"
        : "text-zinc-600 font-medium hover:text-zinc-950"
    );

  const getMobileLinkClass = (key: string) =>
    cn(
      "px-3 py-2 rounded-lg text-sm transition-colors text-left",
      currentSection === key
        ? "text-[#185adb] font-bold bg-blue-50/60"
        : "font-medium text-zinc-700 hover:bg-zinc-50"
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-5 sm:pt-6 px-4 sm:px-6 pointer-events-none transition-all duration-300">
      <div className="mx-auto max-w-fit pointer-events-auto">
        <nav
          ref={navRef}
          aria-label="Navigasi utama"
          className={cn(
            "relative flex items-center gap-4 sm:gap-7 rounded-full bg-white/95 px-3.5 py-2 sm:pl-6 sm:pr-2.5 sm:py-2.5 backdrop-blur-md transition-all duration-300",
            navBorderAndShadow
          )}
        >
          {/* Logo */}
          <BrandLogo variant="blue" label={brandName} shadowed={shadowed} />

          {/* Navigasi desktop */}
          <div className="hidden md:flex items-center gap-7 px-2.5 sm:px-3.5 text-[14px]">
            {activePage === "home" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleHomeNav("beranda")}
                  className={getDesktopLinkClass("beranda")}
                >
                  Beranda
                </button>
                <button
                  type="button"
                  onClick={() => handleHomeNav("tentang")}
                  className={getDesktopLinkClass("tentang")}
                >
                  Tentang
                </button>
              </>
            ) : (
              <>
                <Link href="/" className={getDesktopLinkClass("beranda")}>
                  Beranda
                </Link>
                <Link
                  href="/#tentang"
                  className={getDesktopLinkClass("tentang")}
                >
                  Tentang
                </Link>
              </>
            )}

            <Link href="/team" className={getDesktopLinkClass("team")}>
              Tim
            </Link>

            {activePage === "home" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleHomeNav("rekrutmen")}
                  className={getDesktopLinkClass("rekrutmen")}
                >
                  Rekrutmen
                </button>
                <button
                  type="button"
                  onClick={() => handleHomeNav("footer")}
                  className={getDesktopLinkClass("kontak")}
                >
                  Kontak
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/#rekrutmen"
                  className={getDesktopLinkClass("rekrutmen")}
                >
                  Rekrutmen
                </Link>
                <Link
                  href="/#footer"
                  className={getDesktopLinkClass("kontak")}
                >
                  Kontak
                </Link>
              </>
            )}
          </div>

          {/* Tombol portofolio & menu mobile */}
          <div className="flex items-center gap-2">
            {activePage === "home" ? (
              <a
                href="#karya"
                onClick={(e) => {
                  e.preventDefault();
                  handleHomeNav("karya");
                }}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full bg-[#185adb] pl-4.5 pr-2 py-2 text-[13.5px] font-medium text-white hover:bg-[#1348b5] transition-all cursor-pointer select-none",
                  shadowed && "shadow-sm"
                )}
              >
                <span>{ctaLabel}</span>
                <AnimatedArrowBadge
                  size="sm"
                  variant="white"
                  shadowed={shadowed}
                />
              </a>
            ) : (
              <Link
                href="/#karya"
                className={cn(
                  "group flex items-center gap-2.5 rounded-full bg-[#185adb] pl-4.5 pr-2 py-2 text-[13.5px] font-medium text-white hover:bg-[#1348b5] transition-all",
                  shadowed && "shadow-sm"
                )}
              >
                <span>{ctaLabel}</span>
                <AnimatedArrowBadge
                  size="sm"
                  variant="white"
                  shadowed={shadowed}
                />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex h-8.5 w-8.5 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
            </button>
          </div>

          {/* Panel dropdown mobile */}
          {mobileMenuOpen && (
            <div
              className={cn(
                "absolute top-full left-0 right-0 mt-3 rounded-2xl bg-white p-4 md:hidden text-zinc-800 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50",
                shadowed
                  ? "shadow-2xl border border-zinc-100"
                  : "border border-zinc-200/90"
              )}
            >
              {activePage === "home" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleHomeNav("beranda")}
                    className={getMobileLinkClass("beranda")}
                  >
                    Beranda
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHomeNav("tentang")}
                    className={getMobileLinkClass("tentang")}
                  >
                    Tentang Creatify
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileLinkClass("beranda")}
                  >
                    Beranda
                  </Link>
                  <Link
                    href="/#tentang"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileLinkClass("tentang")}
                  >
                    Tentang Creatify
                  </Link>
                </>
              )}

              <Link
                href="/team"
                onClick={() => setMobileMenuOpen(false)}
                className={getMobileLinkClass("team")}
              >
                Tim Creatify
              </Link>

              {activePage === "home" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleHomeNav("rekrutmen")}
                    className={getMobileLinkClass("rekrutmen")}
                  >
                    Informasi Rekrutmen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHomeNav("footer")}
                    className={getMobileLinkClass("kontak")}
                  >
                    Kontak Resmi
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/#rekrutmen"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileLinkClass("rekrutmen")}
                  >
                    Informasi Rekrutmen
                  </Link>
                  <Link
                    href="/#footer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileLinkClass("kontak")}
                  >
                    Kontak Resmi
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

