"use client";

import { useState, useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { useDismissableLayers } from "@/hooks/useDismissableLayer";
import { DEFAULT_SITE_SETTINGS } from "@/config/landing-cms";

export type LandingSectionId =
  | "beranda"
  | "tentang"
  | "rekrutmen"
  | "kontak"
  | "footer"
  | "karya";

interface NavItemConfig {
  key: "beranda" | "tentang" | "team" | "rekrutmen" | "kontak";
  desktopLabel: string;
  mobileLabel: string;
  sectionId: LandingSectionId | null;
  href: string;
}

const NAV_ITEMS: readonly NavItemConfig[] = [
  {
    key: "beranda",
    desktopLabel: "Beranda",
    mobileLabel: "Beranda",
    sectionId: "beranda",
    href: "/",
  },
  {
    key: "tentang",
    desktopLabel: "Tentang",
    mobileLabel: "Tentang Creatify",
    sectionId: "tentang",
    href: "/#tentang",
  },
  {
    key: "team",
    desktopLabel: "Tim",
    mobileLabel: "Tim Creatify",
    sectionId: null,
    href: "/team",
  },
  {
    key: "rekrutmen",
    desktopLabel: "Rekrutmen",
    mobileLabel: "Informasi Rekrutmen",
    sectionId: "rekrutmen",
    href: "/#rekrutmen",
  },
  {
    key: "kontak",
    desktopLabel: "Kontak",
    mobileLabel: "Kontak Resmi",
    sectionId: "footer",
    href: "/#footer",
  },
];

interface PublicNavbarProps {
  activePage: "home" | "team";
  activeSection?: string;
  isScrolled?: boolean;
  shadowed?: boolean;
  animateOnMount?: boolean;
  brandName?: string;
  ctaLabel?: string;
  onNavigateSection?: (sectionId: LandingSectionId) => void;
}

export function PublicNavbar({
  activePage,
  activeSection = "beranda",
  isScrolled = false,
  shadowed = false,
  animateOnMount = false,
  brandName = DEFAULT_SITE_SETTINGS.name,
  ctaLabel = DEFAULT_SITE_SETTINGS.navbarCtaLabel,
  onNavigateSection,
}: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useDismissableLayers([
    {
      ref: navRef,
      enabled: mobileMenuOpen,
      onDismiss: () => setMobileMenuOpen(false),
    },
  ]);

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

  const renderNavItem = (item: NavItemConfig, mode: "desktop" | "mobile") => {
    const isDesktop = mode === "desktop";
    const isActive = currentSection === item.key;
    const label = isDesktop ? item.desktopLabel : item.mobileLabel;
    const linkClass = isDesktop
      ? cn(
          "transition-colors cursor-pointer select-none",
          isActive
            ? "text-[#185adb] font-bold"
            : "text-zinc-600 font-medium hover:text-zinc-950"
        )
      : cn(
          "py-3.5 text-[18px] text-left transition-colors",
          isActive
            ? "font-semibold text-[#185adb]"
            : "font-medium text-zinc-900 hover:text-[#185adb]"
        );
    const mobileTabIndex = isDesktop || mobileMenuOpen ? undefined : -1;

    if (activePage === "home" && item.sectionId) {
      const targetId = item.sectionId;
      return (
        <button
          key={item.key}
          type="button"
          tabIndex={mobileTabIndex}
          onClick={() => handleHomeNav(targetId)}
          className={cn(linkClass, !isDesktop && "cursor-pointer")}
        >
          {label}
        </button>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        tabIndex={mobileTabIndex}
        onClick={isDesktop ? undefined : () => setMobileMenuOpen(false)}
        className={linkClass}
      >
        {label}
      </Link>
    );
  };

  const renderPortfolioCta = (
    className: string,
    isMobile = false,
    badge?: ReactNode
  ) =>
    activePage === "home" ? (
      <a
        href="#karya"
        tabIndex={isMobile && !mobileMenuOpen ? -1 : undefined}
        onClick={(e) => {
          e.preventDefault();
          handleHomeNav("karya");
        }}
        className={cn(className, "cursor-pointer")}
      >
        <span>{ctaLabel}</span>
        {badge}
      </a>
    ) : (
      <Link
        href="/#karya"
        tabIndex={isMobile && !mobileMenuOpen ? -1 : undefined}
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
        className={className}
      >
        <span>{ctaLabel}</span>
        {badge}
      </Link>
    );

  return (
    <header
      style={
        animateOnMount
          ? ({
              "--hero-delay": "0ms",
              "--hero-duration": "0.75s",
              "--hero-y": "-72px",
              "--hero-scale": "1",
            } as CSSProperties)
          : undefined
      }
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-3.5 md:pt-6 px-3.5 sm:px-6 pointer-events-none transition-[padding] duration-300",
        animateOnMount && "hero-enter"
      )}
    >
      <div className="mx-auto w-full max-w-[460px] md:max-w-fit pointer-events-auto">
        <nav
          ref={navRef}
          aria-label="Navigasi utama"
          className={cn(
            "relative flex flex-col md:flex-row md:items-center md:gap-7 md:rounded-full bg-white md:bg-white/95 px-3.5 py-2.5 md:pl-3.5 md:pr-2.5 md:py-2.5 md:backdrop-blur-md transition-[box-shadow,border-color,background-color] duration-300",
            mobileMenuOpen ? "rounded-[30px]" : "rounded-full",
            navBorderAndShadow,
            mobileMenuOpen && "bg-white shadow-[0_20px_50px_rgba(12,15,29,0.18)]"
          )}
        >
          {/* Baris utama pill navbar */}
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
            {/* Logo */}
            <BrandLogo
              variant="blue"
              shape="circle"
              label={brandName}
              shadowed={shadowed}
              textClassName="text-[20px]"
            />

            {/* Tombol menu hamburger khusus mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex h-10 w-8 items-center justify-center text-zinc-900 hover:text-zinc-600 transition-colors duration-200 cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Menu
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    mobileMenuOpen
                      ? "opacity-0 scale-75 rotate-90"
                      : "opacity-100 scale-100 rotate-0"
                  )}
                />
                <X
                  className={cn(
                    "absolute h-5 w-5 transition-all duration-200",
                    mobileMenuOpen
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-75 -rotate-90"
                  )}
                />
              </span>
            </button>
          </div>

          {/* Navigasi desktop */}
          <div className="hidden md:flex items-center gap-7 px-2.5 sm:px-3.5 text-[14px]">
            {NAV_ITEMS.map((item) => renderNavItem(item, "desktop"))}
          </div>

          {/* Tombol portofolio khusus desktop */}
          <div className="hidden md:flex items-center">
            {renderPortfolioCta(
              cn(
                "group flex items-center gap-2.5 rounded-full bg-[#185adb] pl-4.5 pr-2 py-2 text-[13.5px] font-medium text-white hover:bg-[#1348b5] transition-all select-none whitespace-nowrap",
                shadowed && "shadow-sm"
              ),
              false,
              <AnimatedArrowBadge
                size="sm"
                variant="white"
                shadowed={shadowed}
              />
            )}
          </div>

          {/* Panel dropdown mobile menyatu dengan animasi ekspansi halus */}
          <div
            aria-hidden={!mobileMenuOpen}
            className={cn(
              "md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              mobileMenuOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  "pt-2.5 pb-1 flex flex-col text-zinc-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  mobileMenuOpen ? "translate-y-0" : "-translate-y-2"
                )}
              >
                <div className="px-2 flex flex-col divide-y divide-zinc-200/75">
                  {NAV_ITEMS.map((item) => renderNavItem(item, "mobile"))}
                </div>

                {/* CTA utama di bagian bawah dropdown mobile */}
                <div className="pt-0.5">
                  {renderPortfolioCta(
                    "flex w-full items-center justify-center rounded-full bg-[#185adb] hover:bg-[#1348b5] px-5 py-3 text-[15px] font-medium text-white transition-colors select-none",
                    true
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

