"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { DEFAULT_LANDING_CONTENT } from "@/config/landing-cms";
import type { DivisionCardContent, DivisionCardIconKey } from "@/types/cms";

const DIVISION_ICONS: Record<DivisionCardIconKey, ReactNode> = {
  smile: (
    <svg
      className="h-7 w-7 sm:h-8 sm:w-8 text-zinc-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 9.5c.6-.6 1.4-.6 2 0" />
      <circle cx="15.5" cy="9.75" r="0.85" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5c1 1.8 3 2.5 5 1.8 1-.3 1.6-.9 2-1.8" />
    </svg>
  ),
  video: (
    <svg
      className="h-7 w-7 sm:h-8 sm:w-8 text-zinc-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  ),
  share: (
    <svg
      className="h-7 w-7 sm:h-8 sm:w-8 text-zinc-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
};

interface PortfolioSectionProps {
  items?: DivisionCardContent[];
}

export function PortfolioSection({
  items = DEFAULT_LANDING_CONTENT.divisions,
}: PortfolioSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = activeIndex < items.length ? activeIndex : 0;

  return (
    <section
      id="divisi"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent text-zinc-950 pt-0 sm:pt-2 pb-12 sm:pb-24 px-4 min-[400px]:px-5 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        {/* Card interaktif divisi kreatif */}
        <ScrollReveal
          variant="scale"
          duration={780}
          distance={28}
          className="flex flex-col md:flex-row gap-3.5 sm:gap-5 h-auto md:h-[520px] lg:h-[550px] xl:h-[570px] w-full"
        >
          {items.map((cat, index) => {
            const isActive = index === safeActiveIndex;
            const icon = DIVISION_ICONS[cat.iconKey] ?? DIVISION_ICONS.smile;

            return (
              <div
                key={cat.id}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? undefined : 0}
                aria-expanded={isActive}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => {
                  if (!isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className={`group relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-black/[0.07] bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] h-auto md:h-full ${
                  isActive
                    ? "md:flex-[3.2] p-2.5 sm:p-3 md:p-3.5 cursor-default"
                    : "md:flex-1 p-2.5 sm:p-3 md:p-3.5 cursor-pointer hover:bg-zinc-50/80"
                }`}
              >
                {/* Tampilan expanded: Detail divisi & preview showcase */}
                {isActive ? (
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-3.5 md:gap-4 md:h-full w-full">
                    {/* Panel informasi divisi */}
                    <div className="flex flex-col gap-3 md:gap-0 md:justify-between w-full md:w-[295px] lg:w-[325px] xl:w-[350px] md:h-full shrink-0">
                      <div className="pt-1.5 pl-1.5 md:pt-2 md:pl-2 shrink-0">
                        {icon}
                      </div>

                      <div className="animate-card-content-up w-full rounded-[18px] sm:rounded-[22px] bg-[#f2f3f5] p-4.5 sm:p-6 flex flex-col justify-start">
                        <div>
                          <h3 className="text-[19px] sm:text-[22px] font-semibold tracking-[-0.02em] text-zinc-950 leading-tight">
                            {cat.title}
                          </h3>
                          <p className="mt-2 sm:mt-2.5 text-[13px] sm:text-[13.5px] font-normal leading-[1.6] text-zinc-600">
                            {cat.description}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-5 flex flex-col gap-1.5 sm:gap-2">
                          <div>
                            <span className="inline-block max-w-full truncate px-3 sm:px-3.5 py-1.5 rounded-full bg-white text-[12px] sm:text-[12.5px] font-normal text-zinc-600 border border-black/[0.04]">
                              {cat.tagRow1}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="inline-block max-w-full truncate px-3 sm:px-3.5 py-1.5 rounded-full bg-white text-[12px] sm:text-[12.5px] font-normal text-zinc-600 border border-black/[0.04]">
                              {cat.tagRow2}
                            </span>
                            <span className="inline-block whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-full bg-white text-[12px] sm:text-[12.5px] font-normal text-zinc-600 border border-black/[0.04] cursor-default">
                              {cat.tagMore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel preview karya */}
                    <div className="animate-card-image-right flex-none h-[210px] min-[400px]:h-[240px] sm:h-[320px] md:flex-1 md:h-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-zinc-100 relative">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="h-full w-full object-cover"
                        decoding="async"
                      />
                    </div>
                  </div>
                ) : (
                  /* Tampilan kartu collapsed */
                  <div className="flex flex-row items-center gap-3 md:flex-col md:justify-between md:items-start md:gap-0 h-full w-full">
                    <div className="pl-1.5 py-1 md:pt-2 md:pl-2 md:py-0 shrink-0">
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0 md:flex-initial w-full">
                      <div className="w-full rounded-[16px] sm:rounded-[18px] bg-[#f2f3f5] py-3 px-4 md:py-4.5 md:px-3 flex items-center justify-between md:justify-center md:text-center transition-colors duration-200 group-hover:bg-[#e7e9ec]">
                        <span className="text-[14.5px] sm:text-[15.5px] font-medium tracking-tight text-zinc-950 truncate md:whitespace-nowrap">
                          {cat.collapsedTitle}
                        </span>
                        <Plus
                          className="h-4 w-4 text-zinc-500 md:hidden shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}