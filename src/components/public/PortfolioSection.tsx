"use client";

import React, { useState } from "react";

interface PortfolioCategory {
  id: string;
  title: string;
  collapsedTitle: string;
  description: string;
  tagRow1: string;
  tagRow2: string;
  tagMore: string;
  image: string;
  icon: React.ReactNode;
}

const CATEGORIES: PortfolioCategory[] = [
  {
    id: "desain-grafis",
    title: "Divisi Desain Grafis",
    collapsedTitle: "Desain Grafis",
    description:
      "Merumuskan identitas visual, panduan grafis resmi, desain feed media sosial, poster event, hingga perlengkapan publikasi kreatif fakultas.",
    tagRow1: "Identitas Visual",
    tagRow2: "Poster & Banner",
    tagMore: "+more",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    icon: (
      /* Ikon senyum */
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
  },
  {
    id: "video-editing",
    title: "Divisi Multimedia & Video",
    collapsedTitle: "Multimedia",
    description:
      "Menggarap produksi video sinematik, aftermovie kegiatan fakultas, konten video vertikal interaktif, serta motion design dinamis berstandar tinggi.",
    tagRow1: "Aftermovie Event",
    tagRow2: "Motion Graphic",
    tagMore: "+more",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    icon: (
      /* Ikon video */
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
  },
  {
    id: "social-media",
    title: "Divisi Media Sosial",
    collapsedTitle: "Media Sosial",
    description:
      "Mengelola ekosistem publikasi digital, menyusun kurasi konten terstruktur, copywriting komunikatif, serta strategi interaktif bersama civitas akademika.",
    tagRow1: "Strategi Konten",
    tagRow2: "Engagement",
    tagMore: "+more",
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80",
    icon: (
      /* Ikon jejaring sosial */
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
  },
];

export function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="divisi"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent text-zinc-950 pt-0 sm:pt-2 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        {/* Card interaktif divisi kreatif */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-5 h-auto md:h-[520px] lg:h-[550px] xl:h-[570px] w-full">
          {CATEGORIES.map((cat, index) => {
            const isActive = index === activeIndex;

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
                className={`group relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-black/[0.07] bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-auto md:h-full ${
                  isActive
                    ? "flex-[3.2] p-2.5 sm:p-3 md:p-3.5 cursor-default"
                    : "flex-1 p-2.5 sm:p-3 md:p-3.5 cursor-pointer hover:bg-zinc-50/80"
                }`}
              >
                {/* Tampilan expanded: Detail divisi & preview showcase */}
                {isActive ? (
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-3.5 md:gap-4 h-full w-full">
                    {/* Panel informasi divisi */}
                    <div className="flex flex-col justify-between w-full md:w-[295px] lg:w-[325px] xl:w-[350px] h-full shrink-0">
                      <div className="pt-2 pl-2 shrink-0">
                        {cat.icon}
                      </div>

                      <div className="animate-card-content-up w-full rounded-[20px] sm:rounded-[22px] bg-[#f2f3f5] p-5 sm:p-6 flex flex-col justify-start">
                        <div>
                          <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-zinc-950 leading-tight">
                            {cat.title}
                          </h3>
                          <p className="mt-2.5 text-[13px] sm:text-[13.5px] font-normal leading-[1.6] text-zinc-600">
                            {cat.description}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-2">
                          <div>
                            <span className="inline-block whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white text-[12.5px] font-normal text-zinc-600 border border-black/[0.04]">
                              {cat.tagRow1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white text-[12.5px] font-normal text-zinc-600 border border-black/[0.04]">
                              {cat.tagRow2}
                            </span>
                            <span className="inline-block whitespace-nowrap px-3 py-1.5 rounded-full bg-white text-[12.5px] font-normal text-zinc-600 border border-black/[0.04] cursor-default">
                              {cat.tagMore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel preview karya */}
                    <div className="animate-card-image-right flex-1 h-[280px] sm:h-[340px] md:h-full rounded-[20px] sm:rounded-[22px] overflow-hidden bg-zinc-100 relative shrink-0">
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
                  <div className="flex flex-col justify-between items-start h-full w-full">
                    <div className="pt-2 pl-2 shrink-0">
                      {cat.icon}
                    </div>

                    <div className="w-full">
                      <div className="w-full rounded-[16px] sm:rounded-[18px] bg-[#f2f3f5] py-4 sm:py-4.5 px-3 flex items-center justify-center text-center transition-colors duration-200 group-hover:bg-[#e7e9ec]">
                        <span className="text-[14.5px] sm:text-[15.5px] font-medium tracking-tight text-zinc-950 whitespace-nowrap">
                          {cat.collapsedTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}