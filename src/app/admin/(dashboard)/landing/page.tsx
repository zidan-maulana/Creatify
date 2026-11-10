"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  LANDING_SECTION_NAV,
  resolveLandingTabKey,
} from "@/config/admin-landing-sections";

function LandingContentEditorInner() {
  const searchParams = useSearchParams();
  const { isHydrated } = useAdminCms();

  const activeTab = resolveLandingTabKey(searchParams.get("tab"));
  const activeSection =
    LANDING_SECTION_NAV.find((item) => item.key === activeTab) ??
    LANDING_SECTION_NAV[0];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title={activeSection.title}
        description={activeSection.description}
        actions={
          <button
            type="submit"
            form={activeSection.formId}
            className="inline-flex items-center justify-center rounded-full bg-[#185adb] hover:bg-[#1348b5] px-6 py-2.5 text-[14px] font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Simpan Perubahan
          </button>
        }
      />

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
