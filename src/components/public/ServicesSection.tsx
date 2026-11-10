"use client";

import React, { useState } from "react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
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

  const currentTab =
    content.tabs.find((tab) => tab.id === activeTab) || content.tabs[0];

  return (
    <section
      id="karya"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent pt-2 sm:pt-4 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        {/* Card utama showcase portofolio & tab layanan */}
        <div className="w-full rounded-[28px] sm:rounded-[34px] lg:rounded-[40px] bg-[#185adb] text-white p-6 sm:p-8 lg:p-12 xl:p-14 relative overflow-hidden">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 sm:gap-6 pb-1">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[48px] font-medium tracking-tight text-white leading-tight">
                {content.title}
              </h2>
              <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15.5px] font-normal text-white/80 max-w-xl leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            {/* Tombol ajakan bergabung menuju form rekrutmen */}
            <a
              href="#rekrutmen"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("rekrutmen")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center justify-between gap-3.5 rounded-full bg-white pl-5 sm:pl-6 pr-2 py-2 text-[14.5px] sm:text-[15px] font-medium text-zinc-950 shadow-[0_12px_30px_rgba(6,25,80,0.18)] hover:bg-zinc-100 transition-colors duration-200 shrink-0 self-start cursor-pointer select-none"
            >
              <span>{content.ctaLabel}</span>
              <AnimatedArrowBadge variant="blue" shadowed />
            </a>
          </div>

          {/* Tab filter kategori karya & layanan */}
          <div
            role="tablist"
            aria-label="Kategori karya Creatify"
            className="mt-6 sm:mt-7 flex flex-wrap gap-2 sm:gap-2.5"
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
                  className={`px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[13.5px] font-medium transition-all duration-200 cursor-pointer select-none ${
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

          {/* Konten showcase portofolio */}
          <div
            key={currentTab.id}
            role="tabpanel"
            className="animate-fade-in-simple mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-stretch"
          >
            {/* Kolom kiri: Deskripsi layanan */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between gap-5 lg:gap-0 h-full py-0.5">
              <h3 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-medium tracking-tight text-white leading-[1.25]">
                {currentTab.headline}
              </h3>

              <p className="text-[14.5px] sm:text-[15.5px] xl:text-[16px] font-normal leading-[1.7] text-white/85">
                {currentTab.description}
              </p>
            </div>

            {/* Kolom kanan: Preview karya portofolio */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="relative w-full aspect-[16/9] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-white/10">
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
        </div>
      </div>
    </section>
  );
}