"use client";

import React from "react";
import { DEFAULT_LANDING_CONTENT } from "@/config/landing-cms";
import type { MarqueeContent } from "@/types/cms";

// Koleksi logo mitra abstrak untuk marquee landing page
const PARTNER_LOGOS = [
  {
    name: "Forma",
    node: (
      <div className="flex items-center gap-3 select-none">
        <svg
          className="w-7 h-7 stage-marquee-logo stage-sync"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <circle cx="10" cy="14" r="7" stroke="currentColor" />
          <circle cx="18" cy="14" r="7" stroke="currentColor" />
        </svg>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Forma
        </span>
      </div>
    ),
  },
  {
    name: "Vertex",
    node: (
      <div className="flex items-center gap-3 select-none">
        <svg
          className="w-7 h-7 stage-marquee-logo stage-sync"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 3L3 23h22L14 3z" />
          <path d="M14 12v11" />
        </svg>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Vertex
        </span>
      </div>
    ),
  },
  {
    name: "Kinetix",
    node: (
      <div className="flex items-center gap-3 select-none">
        <div className="flex items-center gap-1.5 h-7">
          <span className="w-1.5 h-4 rounded-full stage-marquee-accent-bg stage-sync" />
          <span className="w-1.5 h-7 rounded-full stage-marquee-accent-bg stage-sync" />
          <span className="w-1.5 h-5 rounded-full stage-marquee-accent-bg stage-sync" />
          <span className="w-1.5 h-3 rounded-full stage-marquee-accent-bg stage-sync" />
        </div>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Kinetix
        </span>
      </div>
    ),
  },
  {
    name: "Nexus",
    node: (
      <div className="flex items-center gap-3 select-none">
        <svg
          className="w-7 h-7 stage-marquee-logo stage-sync"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="5" width="7" height="7" rx="1.5" />
          <rect x="16" y="5" width="7" height="7" rx="1.5" />
          <rect x="5" y="16" width="7" height="7" rx="1.5" />
          <rect x="16" y="16" width="7" height="7" rx="1.5" />
          <line x1="12" y1="8.5" x2="16" y2="8.5" />
          <line x1="8.5" y1="12" x2="8.5" y2="16" />
          <line x1="19.5" y1="12" x2="19.5" y2="16" />
          <line x1="12" y1="19.5" x2="16" y2="19.5" />
        </svg>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Nexus
        </span>
      </div>
    ),
  },
  {
    name: "Aura",
    node: (
      <div className="flex items-center gap-3 select-none">
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="absolute w-7 h-7 rounded-full border-[2.5px] stage-marquee-logo-border stage-sync" />
          <div className="absolute w-3 h-3 rounded-full stage-marquee-logo-bg stage-sync" />
        </div>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Aura
        </span>
      </div>
    ),
  },
  {
    name: "Onyx",
    node: (
      <div className="flex items-center gap-3 select-none">
        <svg
          className="w-7 h-7 stage-marquee-logo stage-sync"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="14,3 24,8.5 24,19.5 14,25 4,19.5 4,8.5" />
          <polyline points="4,8.5 14,14 24,8.5" />
          <line x1="14" y1="14" x2="14" y2="25" />
        </svg>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Onyx
        </span>
      </div>
    ),
  },
  {
    name: "Monolith",
    node: (
      <div className="flex items-center gap-3 select-none">
        <div className="flex items-center gap-1.5 h-7">
          <div className="w-2.5 h-7 rounded-[4px] stage-marquee-logo-bg stage-sync" />
          <div className="w-2.5 h-5 rounded-[4px] stage-marquee-logo-bg stage-sync" />
        </div>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Monolith
        </span>
      </div>
    ),
  },
  {
    name: "Astral",
    node: (
      <div className="flex items-center gap-3 select-none">
        <svg
          className="w-7 h-7 stage-marquee-logo-fill stage-sync"
          viewBox="0 0 28 28"
        >
          <path d="M14 2L16.8 11.2L26 14L16.8 16.8L14 26L11.2 16.8L2 14L11.2 11.2L14 2Z" />
        </svg>
        <span className="text-[23px] sm:text-[26px] font-bold tracking-tight stage-marquee-logo stage-sync">
          Astral
        </span>
      </div>
    ),
  },
];

interface LogoMarqueeProps {
  content?: MarqueeContent;
}

export function LogoMarquee({
  content = DEFAULT_LANDING_CONTENT.marquee,
}: LogoMarqueeProps) {
  return (
    <section className="relative w-full overflow-hidden bg-transparent pt-5 sm:pt-7 pb-6 sm:pb-8">
      {/* Label kemitraan fakultas */}
      <div className="text-center px-4 mb-6 sm:mb-8">
        <p className="text-[13px] sm:text-[14.5px] font-medium tracking-tight stage-marquee-label stage-sync">
          {content.trustLabel}
        </p>
      </div>

      {/* Marquee track animasi logo mitra */}
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12 xl:px-14">
        <div
          className="relative w-full overflow-hidden flex items-center py-2"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {/* Track animasi loop berjalan */}
          <div className="marquee-track flex w-max">
            {[0, 1].map((trackIndex) => (
              <div
                key={trackIndex}
                aria-hidden={trackIndex === 1 || undefined}
                className="flex items-center gap-16 sm:gap-20 md:gap-24 pr-16 sm:pr-20 md:pr-24 shrink-0"
              >
                {PARTNER_LOGOS.map((logo) => (
                  <div
                    key={`${trackIndex}-${logo.name}`}
                    className="shrink-0 transition-opacity duration-200 opacity-85 hover:opacity-100"
                  >
                    {logo.node}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 30s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
