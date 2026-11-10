"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileEdit,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { AdminToast } from "@/components/admin/AdminField";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";
import {
  LANDING_SECTION_NAV,
  resolveLandingTabKey,
  type LandingTabKey,
} from "@/config/admin-landing-sections";
import { cn } from "@/lib/utils";

function getEmailInitials(email: string): string {
  const local = email.split("@")[0]?.trim() || "A";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

const TOP_NAV_ITEM = {
  href: "/admin",
  label: "Ringkasan",
  icon: LayoutDashboard,
} as const;

const BOTTOM_NAV_ITEMS = [
  { href: "/admin/team", label: "Tim & Pengurus", icon: Users },
  { href: "/admin/settings", label: "Kontak & Situs", icon: Settings },
] as const;

interface SidebarNavContentProps {
  pathname: string;
  activeTab: LandingTabKey;
  isLandingExpanded: boolean;
  onToggleLanding: () => void;
  onNavigate?: () => void;
}

function SidebarNavContent({
  pathname,
  activeTab,
  isLandingExpanded,
  onToggleLanding,
  onNavigate,
}: SidebarNavContentProps) {
  const isOverviewActive = pathname === "/admin";
  const isLandingRoute = pathname.startsWith("/admin/landing");
  const TopIcon = TOP_NAV_ITEM.icon;

  return (
    <nav aria-label="Navigasi CMS Admin" className="space-y-1.5">
      <Link
        href={TOP_NAV_ITEM.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 select-none",
          isOverviewActive
            ? "bg-[#185adb] text-white"
            : "text-zinc-600 hover:bg-[#f4f5f7] hover:text-[#0c0f1d]"
        )}
      >
        <TopIcon className="h-[18px] w-[18px] shrink-0 stroke-[2]" />
        <span>{TOP_NAV_ITEM.label}</span>
      </Link>

      {/* Group Konten Landing beserta sub-navigasi per section */}
      <div>
        <div
          className={cn(
            "flex items-center rounded-full transition-colors duration-200 select-none",
            isLandingRoute
              ? "bg-[#f4f5f7] text-[#0c0f1d]"
              : "text-zinc-600 hover:bg-[#f4f5f7] hover:text-[#0c0f1d]"
          )}
        >
          <Link
            href="/admin/landing"
            onClick={onNavigate}
            className="flex-1 flex items-center gap-3 min-w-0 py-2.5 pl-4 pr-2 text-[14px] font-medium"
          >
            <FileEdit
              className={cn(
                "h-[18px] w-[18px] shrink-0 stroke-[2]",
                isLandingRoute && "text-[#185adb]"
              )}
            />
            <span className="truncate">Konten Landing</span>
          </Link>

          <button
            type="button"
            onClick={onToggleLanding}
            aria-expanded={isLandingExpanded}
            aria-label="Tampilkan atau sembunyikan submenu Konten Landing"
            className="mr-1.5 flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 hover:bg-black/[0.06] hover:text-[#0c0f1d] transition-colors cursor-pointer shrink-0"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isLandingExpanded && "rotate-180"
              )}
            />
          </button>
        </div>

        {isLandingExpanded && (
          <div className="mt-1.5 ml-4 pl-3 border-l border-zinc-200/80 space-y-1">
            {LANDING_SECTION_NAV.map((sec) => {
              const isSubActive = isLandingRoute && activeTab === sec.key;
              return (
                <Link
                  key={sec.key}
                  href={`/admin/landing?tab=${sec.key}`}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium transition-colors select-none",
                    isSubActive
                      ? "bg-[#185adb] text-white"
                      : "text-zinc-600 hover:bg-[#f4f5f7] hover:text-[#0c0f1d]"
                  )}
                >
                  <span
                    className={cn(
                      "text-[11px] font-semibold tabular-nums shrink-0",
                      isSubActive ? "text-white/85" : "text-[#185adb]"
                    )}
                  >
                    {sec.step}
                  </span>
                  <span className="truncate">{sec.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 select-none",
              isActive
                ? "bg-[#185adb] text-white"
                : "text-zinc-600 hover:bg-[#f4f5f7] hover:text-[#0c0f1d]"
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0 stroke-[2]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarNavWithSearchParams({
  pathname,
  isLandingExpanded,
  onToggleLanding,
  onNavigate,
}: Omit<SidebarNavContentProps, "activeTab">) {
  const searchParams = useSearchParams();
  const activeTab = resolveLandingTabKey(searchParams.get("tab"));

  return (
    <SidebarNavContent
      pathname={pathname}
      activeTab={activeTab}
      isLandingExpanded={isLandingExpanded}
      onToggleLanding={onToggleLanding}
      onNavigate={onNavigate}
    />
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [landingMenuState, setLandingMenuState] = useState<{
    path: string;
    open: boolean;
  } | null>(null);
  const { landingContent, adminEmail, toast, dismissToast } = useAdminCms();

  const isLandingRoute = pathname.startsWith("/admin/landing");
  const isLandingExpanded =
    landingMenuState?.path === pathname
      ? landingMenuState.open
      : isLandingRoute;

  const toggleLandingMenu = () => {
    setLandingMenuState({
      path: pathname,
      open: !isLandingExpanded,
    });
  };

  const renderNavLinks = (onNavigate?: () => void) => (
    <Suspense
      fallback={
        <SidebarNavContent
          pathname={pathname}
          activeTab="hero"
          isLandingExpanded={isLandingExpanded}
          onToggleLanding={toggleLandingMenu}
          onNavigate={onNavigate}
        />
      }
    >
      <SidebarNavWithSearchParams
        pathname={pathname}
        isLandingExpanded={isLandingExpanded}
        onToggleLanding={toggleLandingMenu}
        onNavigate={onNavigate}
      />
    </Suspense>
  );

  const avatarInitials = getEmailInitials(adminEmail);

  const renderSidebarFooter = (onNavigate?: () => void) => (
    <div className="space-y-2.5 pt-4 border-t border-zinc-200/80">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="group flex items-center justify-between gap-2.5 rounded-full bg-[#185adb] pl-4.5 pr-2 py-2 text-[13.5px] font-medium text-white hover:bg-[#1348b5] transition-colors cursor-pointer select-none"
      >
        <span>Lihat Website</span>
        <AnimatedArrowBadge size="sm" variant="white" />
      </Link>

      <Link
        href="/admin/login"
        onClick={onNavigate}
        aria-label={`Keluar Admin (${adminEmail})`}
        title={`Keluar Admin · ${adminEmail}`}
        className="group flex items-center gap-2.5 rounded-full border border-zinc-200/90 bg-white pl-2 pr-3.5 py-2 hover:bg-zinc-50 hover:border-zinc-300 transition-colors select-none"
      >
        <span
          aria-hidden="true"
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#185adb] text-[10.5px] font-semibold tracking-tight text-white"
        >
          {avatarInitials}
        </span>

        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[#0c0f1d] leading-snug">
          {adminEmail}
        </span>

        <LogOut className="h-4 w-4 text-zinc-400 group-hover:text-red-500 transition-colors shrink-0" />
      </Link>
    </div>
  );

  return (
    <div
      style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      className="min-h-screen flex bg-[#f4f5f7] text-[#0c0f1d] selection:bg-[#185adb] selection:text-white"
    >
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-[268px] shrink-0 flex-col justify-between gap-6 border-r border-zinc-200/80 bg-white p-5 sticky top-0 h-screen overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1.5 pt-1">
            <BrandLogo variant="blue" label={landingContent.siteSettings.name} />
            <span className="rounded-full bg-[#185adb]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#185adb]">
              CMS
            </span>
          </div>

          {renderNavLinks()}
        </div>

        {renderSidebarFooter()}
      </aside>

      {/* Drawer navigasi mobile */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-[#0c0f1d]/40 backdrop-blur-[2px]"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <aside
            className="w-[280px] max-w-[85vw] h-full bg-white p-5 flex flex-col justify-between gap-6 border-r border-zinc-200/80 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <BrandLogo
                  variant="blue"
                  label={landingContent.siteSettings.name}
                />
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Tutup menu admin"
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              {renderNavLinks(() => setMobileDrawerOpen(false))}
            </div>

            {renderSidebarFooter(() => setMobileDrawerOpen(false))}
          </aside>
        </div>
      )}

      {/* Kolom konten utama */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Kontrol drawer khusus layar kecil */}
        <div className="lg:hidden sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-5 flex items-center justify-between">
          <BrandLogo variant="blue" label={landingContent.siteSettings.name} />
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Buka menu navigasi admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/90 text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Workspace */}
        <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
          <div className="mx-auto max-w-[1220px]">{children}</div>
        </main>
      </div>

      <AdminToast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
