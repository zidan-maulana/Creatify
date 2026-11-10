"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
} from "@/config/landing-cms";
import type { FaqSectionContent, SiteSettingsContent } from "@/types/cms";

interface FaqSectionProps {
  content?: FaqSectionContent;
  siteSettings?: SiteSettingsContent;
}

export function FaqSection({
  content = DEFAULT_LANDING_CONTENT.faq,
  siteSettings = DEFAULT_SITE_SETTINGS,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const emailHref = `mailto:${siteSettings.email}`;

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Animasi entrance saat section memasuki viewport
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Animasi scroll-follow halus mengikuti posisi scroll sampai batas bawah section
  useEffect(() => {
    const container = gridRef.current;
    const stickyEl = stickyRef.current;
    if (!container || !stickyEl) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let currentY = 0;
    let targetY = 0;
    let rafId: number | null = null;
    const stickyTopOffset = 128;

    const animate = () => {
      if (!desktopQuery.matches) {
        stickyEl.style.transform = "";
        rafId = null;
        return;
      }

      const diff = targetY - currentY;
      currentY += diff * 0.14;

      if (Math.abs(diff) < 0.2) {
        currentY = targetY;
        stickyEl.style.transform = `translate3d(0, ${
          Math.round(currentY * 100) / 100
        }px, 0)`;
        rafId = null;
        return;
      }

      stickyEl.style.transform = `translate3d(0, ${
        Math.round(currentY * 100) / 100
      }px, 0)`;
      rafId = window.requestAnimationFrame(animate);
    };

    const computeTarget = () => {
      if (!desktopQuery.matches) {
        targetY = 0;
        currentY = 0;
        stickyEl.style.transform = "";
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const stickyHeight = stickyEl.offsetHeight;
      const maxTravel = Math.max(0, containerRect.height - stickyHeight);
      const rawTarget = stickyTopOffset - containerRect.top;
      targetY = Math.min(Math.max(rawTarget, 0), maxTravel);

      if (reducedMotionQuery.matches) {
        currentY = targetY;
        stickyEl.style.transform = `translate3d(0, ${currentY}px, 0)`;
        return;
      }

      if (rafId === null) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    computeTarget();

    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget, { passive: true });

    // Sinkronkan batas bawah saat tinggi accordion berubah
    const resizeObserver = new ResizeObserver(computeTarget);
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("scroll", computeTarget);
      window.removeEventListener("resize", computeTarget);
      resizeObserver.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      stickyEl.style.transform = "";
    };
  }, []);

  return (
    <section
      id="faq"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent text-zinc-950 pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-24 md:pb-28 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1360px]">
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10 items-start"
        >
          {/* Kolom kiri: Judul section, pengantar & CTA email */}
          <div
            ref={stickyRef}
            className="lg:col-span-4 xl:col-span-4 will-change-transform"
          >
            <div
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-[42px] sm:text-[50px] lg:text-[52px] xl:text-[64px] font-medium tracking-[-0.03em] text-[#0c0f1d] leading-[1.06]">
                <span className="block">{content.titleLine1}</span>
                <span className="block">{content.titleLine2}</span>
              </h2>

              <p className="mt-5 sm:mt-6 max-w-[360px] text-[15.5px] sm:text-[16.5px] xl:text-[17px] font-normal leading-[1.6] text-zinc-500">
                {content.subtitle}
              </p>

              <div className="mt-7 sm:mt-8">
                <a
                  href={emailHref}
                  className="group inline-flex items-center justify-between gap-3.5 rounded-full border border-zinc-200/90 bg-white pl-6 pr-2 py-2 text-[14.5px] sm:text-[15px] font-medium text-[#0c0f1d] hover:border-zinc-300 hover:bg-zinc-50 transition-colors duration-200 cursor-pointer select-none"
                >
                  <span>{content.ctaLabel}</span>
                  <AnimatedArrowBadge variant="blue" />
                </a>
              </div>
            </div>
          </div>

          {/* Kolom kanan: Daftar accordion pertanyaan FAQ */}
          <div className="lg:col-span-8 xl:col-span-8 border-t border-b border-zinc-200/80 divide-y divide-zinc-200/80">
            {content.items.map((item, index) => {
              const isOpen = openIndex === index;
              const buttonId = `faq-button-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <div key={item.id}>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(index)}
                    className={`group w-full flex items-center justify-between gap-6 text-left cursor-pointer select-none transition-[padding] duration-300 ${
                      isOpen ? "pt-6 sm:pt-7 pb-3 sm:pb-3.5" : "py-6 sm:py-7"
                    }`}
                  >
                    <span className="text-[17.5px] sm:text-[19.5px] lg:text-[21px] font-medium tracking-[-0.015em] leading-[1.4] text-[#0c0f1d]">
                      {item.question}
                    </span>

                    {/* Ikon plus/minus simetris */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className={`h-[20px] w-[20px] shrink-0 transition-colors duration-200 ${
                        isOpen
                          ? "text-[#185adb]"
                          : "text-[#0c0f1d]/80 group-hover:text-[#185adb]"
                      }`}
                    >
                      <line x1="3" y1="9" x2="15" y2="9" />
                      <line
                        x1="9"
                        y1="3"
                        x2="9"
                        y2="15"
                        style={{ transformOrigin: "9px 9px" }}
                        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isOpen
                            ? "scale-y-0 rotate-90 opacity-0"
                            : "scale-y-100 rotate-0 opacity-100"
                        }`}
                      />
                    </svg>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 sm:pb-7 pr-6 sm:pr-8 text-[15px] sm:text-[15.5px] lg:text-[16px] xl:text-[16.5px] font-normal leading-[1.65] text-zinc-500">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

