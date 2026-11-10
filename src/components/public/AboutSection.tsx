import React from "react";
import Link from "next/link";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { DEFAULT_LANDING_CONTENT } from "@/config/landing-cms";
import type { AboutContent } from "@/types/cms";

interface AboutSectionProps {
  content?: AboutContent;
}

export function AboutSection({
  content = DEFAULT_LANDING_CONTENT.about,
}: AboutSectionProps) {
  return (
    <section
      id="tentang"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent text-zinc-950 pt-2 sm:pt-4 md:pt-6 pb-10 sm:pb-12 md:pb-14 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start lg:items-stretch">
          {/* Kolom kiri: Editorial headline dengan visual image pills */}
          <div className="lg:col-span-7 xl:col-span-7">
            <h2 className="flex flex-col gap-1 sm:gap-1.5 text-[26px] sm:text-[30px] md:text-[34px] lg:text-[40px] xl:text-[43px] font-medium tracking-[-0.025em] stage-fg stage-sync leading-[1.2] sm:leading-[1.18] text-left">
              <span className="block">
                <span>{content.headlineLine1Before} </span>
                <span
                  aria-hidden="true"
                  className="relative inline-flex items-center justify-center h-[25px] sm:h-[29px] md:h-[32px] lg:h-[36px] xl:h-[39px] w-[52px] sm:w-[60px] md:w-[67px] lg:w-[75px] xl:w-[80px] rounded-full overflow-hidden shrink-0 align-middle -translate-y-[0.06em] mx-1 sm:mx-1.5 select-none"
                >
                  <img
                    src={content.pillImage1Url}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>{content.headlineLine1After}</span>
              </span>

              <span className="block">
                <span>{content.headlineLine2}</span>
              </span>

              <span className="block">
                <span>{content.headlineLine3Before} </span>
                <span
                  aria-hidden="true"
                  className="relative inline-flex items-center justify-center h-[25px] sm:h-[29px] md:h-[32px] lg:h-[36px] xl:h-[39px] w-[52px] sm:w-[60px] md:w-[67px] lg:w-[75px] xl:w-[80px] rounded-full overflow-hidden shrink-0 align-middle -translate-y-[0.06em] mx-1 sm:mx-1.5 select-none"
                >
                  <img
                    src={content.pillImage2Url}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>{content.headlineLine3After}</span>
              </span>

              <span className="block">
                <span>{content.headlineLine4}</span>
              </span>
            </h2>
          </div>

          {/* Kolom kanan: Ringkasan profil & navigasi tim */}
          <div className="lg:col-span-5 xl:col-span-5 pt-0.5 lg:pb-2 flex flex-col justify-between gap-4 text-[14.5px] sm:text-[15px] font-normal leading-[1.65] w-full text-left">
            <p className="stage-muted stage-sync">{content.description}</p>

            {/* Tombol menuju halaman tim */}
            <div className="pt-0 lg:-translate-y-0.5">
              <Link
                href="/team"
                className="group inline-flex items-center justify-between gap-3.5 rounded-full border border-zinc-200/90 bg-white pl-5 pr-1.5 py-1.5 text-[13.5px] sm:text-[14px] font-medium text-[#0c0f1d] hover:border-zinc-300 hover:bg-zinc-50 transition-colors duration-200 cursor-pointer self-start select-none"
              >
                <span>{content.ctaLabel}</span>
                <AnimatedArrowBadge variant="blue" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
