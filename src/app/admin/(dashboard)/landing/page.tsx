"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HeroEditor,
  MarqueeAboutEditor,
} from "@/components/admin/editors/HeroAboutEditors";
import {
  DivisionsEditor,
  ServicesEditor,
} from "@/components/admin/editors/ShowcaseEditors";
import {
  FaqEditor,
  ContactFooterEditor,
} from "@/components/admin/editors/FaqContactEditors";
import { AdminSectionHeader } from "@/components/admin/AdminField";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";
import { useUnsavedChanges } from "@/components/admin/UnsavedChangesProvider";
import {
  LANDING_SECTION_NAV,
  resolveLandingTabKey,
} from "@/config/admin-landing-sections";
import { cn } from "@/lib/utils";

function LandingContentEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isHydrated } = useAdminCms();
  const { isDirty, confirmNavigation } = useUnsavedChanges();

  const activeTab = resolveLandingTabKey(searchParams.get("tab"));
  const activeSection =
    LANDING_SECTION_NAV.find((item) => item.key === activeTab) ??
    LANDING_SECTION_NAV[0];

  const handleTabChange = (targetKey: string) => {
    if (targetKey === activeTab) return;
    const targetUrl = `/admin/landing?tab=${targetKey}`;
    if (isDirty) {
      confirmNavigation(() => {
        router.push(targetUrl);
      });
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title={activeSection.title}
        description={activeSection.description}
        actions={
          <button
            type="submit"
            form={activeSection.formId}
            className={cn(
              "inline-flex items-center justify-center rounded-full bg-[#185adb] hover:bg-[#1348b5] px-6 py-2.5 text-[14px] font-medium text-white transition-all cursor-pointer whitespace-nowrap",
              isDirty &&
                "shadow-[0_4px_16px_rgba(24,90,219,0.35)] ring-2 ring-[#185adb]/30 font-semibold"
            )}
          >
            Simpan Perubahan
          </button>
        }
      />

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {LANDING_SECTION_NAV.map((sec) => {
          const isSelected = sec.key === activeTab;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => handleTabChange(sec.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all shrink-0 cursor-pointer select-none",
                isSelected
                  ? "bg-[#185adb] text-white shadow-sm"
                  : "bg-white border border-zinc-200/80 text-zinc-600 hover:bg-zinc-50 hover:text-[#0c0f1d]"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold tabular-nums",
                  isSelected ? "text-white/85" : "text-[#185adb]"
                )}
              >
                {sec.step}
              </span>
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Konten Editor per Section */}
      <div key={`${activeTab}-${isHydrated ? "ready" : "ssr"}`}>
        {activeTab === "hero" && <HeroEditor />}
        {activeTab === "tentang" && <MarqueeAboutEditor />}
        {activeTab === "divisi" && <DivisionsEditor />}
        {activeTab === "karya" && <ServicesEditor />}
        {activeTab === "faq" && <FaqEditor />}
        {activeTab === "rekrutmen" && <ContactFooterEditor />}
      </div>
    </div>
  );
}

export default function AdminLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 rounded-[28px] bg-white border border-zinc-200/80 animate-pulse" />
      }
    >
      <LandingContentEditorInner />
    </Suspense>
  );
}
