"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useDismissableLayers } from "@/hooks/useDismissableLayer";
import { DEFAULT_LANDING_CONTENT } from "@/config/landing-cms";
import type { ServicesSectionContent } from "@/types/cms";

interface ServicesSectionProps {
  content?: ServicesSectionContent;
}

export function ServicesSection({
  content = DEFAULT_LANDING_CONTENT.services,
}: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>(
    content.tabs[0]?.id ?? "identitas-visual"
  );
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef<HTMLDivElement>(null);

  useDismissableLayers([
    {
      ref: tabDropdownRef,
      enabled: isTabDropdownOpen,
      onDismiss: () => setIsTabDropdownOpen(false),
    },
  ]);

  const currentTab =
    content.tabs.find((tab) => tab.id === activeTab) || content.tabs[0];

  return (
    <section
      id="karya"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent pt-2 sm:pt-4 pb-10 sm:pb-16 px-4 min-[400px]:px-5 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        {/* Card utama showcase portofolio & tab layanan */}
        <ScrollReveal
          variant="scale"
          duration={680}
          distance={26}
          className="w-full rounded-[24px] sm:rounded-[34px] lg:rounded-[40px] bg-[#185adb] text-white p-5 sm:p-8 lg:p-12 xl:p-14 relative overflow-hidden"
        >
          <ScrollReveal delay={80} duration={640} distance={18} className="relative z-20">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6 pb-1">
            <div>
              <h2 className="text-[28px] sm:text-4xl lg:text-[46px] xl:text-[48px] font-medium tracking-tight text-white leading-tight">
                {content.title}
              </h2>
              <p className="mt-2 sm:mt-3 text-[13.5px] sm:text-[15.5px] font-normal text-white/80 max-w-xl leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            {/* Tombol ajakan bergabung menuju form rekrutmen (khusus desktop) */}
            <a
              href="#rekrutmen"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("rekrutmen")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden md:flex group items-center justify-between gap-3.5 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-medium text-zinc-950 shadow-[0_12px_30px_rgba(6,25,80,0.18)] hover:bg-zinc-100 transition-colors duration-200 shrink-0 self-start cursor-pointer select-none"
            >
              <span>{content.ctaLabel}</span>
              <AnimatedArrowBadge variant="blue" shadowed />
            </a>
          </div>

          {/* Dropdown pemilih kategori karya khusus mobile */}
          <div ref={tabDropdownRef} className="md:hidden relative mt-4">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isTabDropdownOpen}
              onClick={() => setIsTabDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 rounded-full bg-white pl-5.5 pr-2.5 py-2.5 text-left text-[15px] font-medium text-zinc-950 shadow-sm hover:bg-zinc-50 transition-colors cursor-pointer select-none"
            >
              <span className="truncate">{currentTab.tabLabel}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#185adb] text-white shrink-0">
                <ChevronDown
                  className={`h-4.5 w-4.5 stroke-[2.2] transition-transform duration-200 ${
                    isTabDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            <div
              role="listbox"
              aria-hidden={!isTabDropdownOpen}
              aria-label="Pilih kategori karya Creatify"
              className={`absolute left-0 right-0 top-full z-20 mt-2 origin-top rounded-2xl border border-zinc-100 bg-white p-1.5 text-zinc-950 shadow-[0_14px_34px_rgba(6,25,80,0.28)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isTabDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-[0.98] -translate-y-1.5 pointer-events-none"
              }`}
            >
              {content.tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="option"
                    tabIndex={isTabDropdownOpen ? undefined : -1}
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsTabDropdownOpen(false);
                    }}
                    className={`w-full flex items-center rounded-xl px-3.5 py-2.5 text-left text-[13.5px] transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#185adb]/10 font-semibold text-[#185adb]"
                        : "font-medium text-zinc-800 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="truncate">{tab.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab filter kategori karya & layanan (desktop) */}
          <div
            role="tablist"
            aria-label="Kategori karya Creatify"
            className="hidden md:flex mt-7 flex-wrap gap-2.5"
          >
            {content.tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4.5 py-2 rounded-full text-[13.5px] font-medium transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "bg-transparent text-white/85 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  {tab.tabLabel}
                </button>
              );
            })}
            </div>
          </ScrollReveal>

          {/* Konten showcase portofolio */}
          <ScrollReveal delay={150} duration={600} distance={20} className="relative z-10">
            <div
              key={currentTab.id}
              role="tabpanel"
              className="animate-fade-in-simple mt-5 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 xl:gap-12 items-stretch"
            >
              {/* Kolom kiri: Deskripsi layanan */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between gap-3.5 sm:gap-5 lg:gap-0 h-full py-0.5">
                <h3 className="text-[22px] sm:text-3xl lg:text-[34px] xl:text-[36px] font-medium tracking-tight text-white leading-[1.28] sm:leading-[1.25]">
                  {currentTab.headline}
                </h3>

                <p className="text-[14px] sm:text-[15.5px] xl:text-[16px] font-normal leading-[1.65] sm:leading-[1.7] text-white/85">
                  {currentTab.description}
                </p>
              </div>

              {/* Kolom kanan: Preview karya portofolio */}
              <div className="lg:col-span-6 xl:col-span-6">
                <div className="relative w-full aspect-[16/9] rounded-[16px] sm:rounded-[22px] overflow-hidden bg-white/10">
                  <img
                    src={currentTab.image}
                    alt={currentTab.tabLabel}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </ScrollReveal>
      </div>
    </section>
  );
}