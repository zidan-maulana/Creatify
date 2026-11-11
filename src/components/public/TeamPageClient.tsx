"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DIVISION_OPTIONS, DivisionId, TeamMember } from "@/data/team";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TEAM_PAGE_CONTENT,
} from "@/config/landing-cms";
import type { SiteSettingsContent, TeamPageContent } from "@/types/cms";

interface TeamPageClientProps {
  content?: TeamPageContent;
  siteSettings?: SiteSettingsContent;
}

export function TeamPageClient({
  content = DEFAULT_TEAM_PAGE_CONTENT,
  siteSettings = DEFAULT_SITE_SETTINGS,
}: TeamPageClientProps) {
  const [selectedDivision, setSelectedDivision] =
    useState<DivisionId>("ketua-wakil");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrolled: boolean | null = null;
    const handleScroll = () => {
      const next = window.scrollY > 20;
      if (next !== lastScrolled) {
        setIsScrolled(next);
        lastScrolled = next;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter anggota sesuai tab divisi terpilih
  const filteredMembers = useMemo(() => {
    if (selectedDivision === "executive-committee") {
      return content.members.filter((m) => m.isLeader);
    }
    return content.members.filter((m) => m.divisionId === selectedDivision);
  }, [content.members, selectedDivision]);

  return (
    <div
      style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      className="min-h-screen bg-white text-zinc-950 flex flex-col selection:bg-[#185adb] selection:text-white pb-16 sm:pb-24 relative overflow-hidden font-sans"
    >
      {/* Navigasi floating header */}
      <PublicNavbar
        activePage="team"
        isScrolled={isScrolled}
        shadowed
        brandName={siteSettings.name}
        ctaLabel={siteSettings.navbarCtaLabel}
      />

      {/* Spacer navigasi header */}
      <div className="h-14 sm:h-20 w-full shrink-0" aria-hidden="true" />

      {/* Header section halaman tim */}
      <section className="relative z-10 pt-8 sm:pt-14 md:pt-16 pb-6 sm:pb-10 px-4 min-[400px]:px-5 sm:px-10 lg:px-12 xl:px-14 text-center w-full max-w-[1360px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[29px] min-[400px]:text-[33px] sm:text-[42px] md:text-[50px] lg:text-[54px] font-medium tracking-[-0.03em] text-zinc-950 leading-[1.15]">
            <span className="block">{content.titleLine1}</span>
            <span className="block">{content.titleLine2}</span>
          </h1>

          <p className="mt-3 sm:mt-4 max-w-xl mx-auto text-[14px] sm:text-[16px] font-normal leading-[1.55] text-zinc-600 sm:whitespace-pre-line">
            {content.subtitle}
          </p>
        </div>

        {/* Badge filter divisi tim */}
        <div
          role="tablist"
          aria-label="Filter divisi tim Creatify"
          className="mt-6 sm:mt-8 -mx-4 px-4 min-[400px]:-mx-5 min-[400px]:px-5 sm:mx-auto sm:w-full max-w-5xl overflow-x-auto no-scrollbar sm:px-4 py-1"
        >
          <div className="w-fit min-w-max mx-auto flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            {DIVISION_OPTIONS.map((opt) => {
              const isSelected = selectedDivision === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDivision(opt.id)}
                  className={`group inline-flex items-center px-3.5 sm:px-4 md:px-4.5 py-1.5 sm:py-2 rounded-full text-[12.5px] sm:text-[13px] md:text-[13.5px] font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-[#185adb] text-white font-semibold shadow-none"
                      : "bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200/90 shadow-none"
                  }`}
                >
                  <span>{opt.badge}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid anggota tim */}
      <section className="relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-4 min-[400px]:px-5 sm:px-10 lg:px-12 xl:px-14">
        {selectedDivision === "ketua-wakil" ? (
          /* Layout eksekutif ketua & wakil */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredMembers.map((member) => (
              <React.Fragment key={member.id}>
                {/* Foto potret anggota */}
                <div className="group relative aspect-[3/4] sm:aspect-auto sm:h-[420px] xl:h-[440px] w-full rounded-[22px] sm:rounded-[28px] overflow-hidden bg-zinc-100 shadow-none transition-all duration-300">
                  <img
                    src={member.photo}
                    alt={`${member.name} - ${member.role}`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Kartu kutipan anggota */}
                <div className="min-h-[260px] h-auto sm:h-[420px] xl:h-[440px] w-full rounded-[22px] sm:rounded-[28px] bg-white border border-zinc-200/80 p-5 sm:p-7 flex flex-col justify-between gap-5 sm:gap-0 shadow-none transition-all duration-300 text-left text-zinc-950">
                  <div>
                    <div className="text-[32px] sm:text-[36px] font-serif text-zinc-900 leading-none mb-3 select-none">
                      ”
                    </div>
                    <h3 className="text-[20px] sm:text-[22px] font-semibold text-zinc-950 leading-[1.25] tracking-[-0.02em]">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-[13px] sm:text-[13.5px] font-normal leading-[1.65] text-zinc-500 line-clamp-5">
                      {member.quoteText}
                    </p>
                  </div>

                  {/* Footer profil */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={member.avatar || member.photo}
                        alt={member.name}
                        className="h-9 w-9 rounded-full object-cover border border-zinc-200/90 shrink-0"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13.5px] font-semibold text-zinc-950 truncate leading-tight">
                          {member.name}
                        </span>
                        <span className="text-[12px] text-zinc-500 truncate leading-tight mt-0.5">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <a
                      href={member.instagramUrl || siteSettings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200/90 text-zinc-700 hover:text-[#e1306c] hover:border-[#e1306c]/40 hover:bg-pink-50/40 transition-colors duration-200 shrink-0"
                      aria-label={`Instagram ${member.name}`}
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* Grid anggota divisi */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {filteredMembers.map((member) => (
              <StandardMemberCard
                key={member.id}
                member={member}
                fallbackInstagramUrl={siteSettings.instagramUrl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Card anggota divisi reusable
function StandardMemberCard({
  member,
  fallbackInstagramUrl,
}: {
  member: TeamMember;
  fallbackInstagramUrl: string;
}) {
  return (
    <div className="group relative aspect-[4/4.6] w-full rounded-[20px] sm:rounded-[26px] overflow-hidden bg-zinc-100 shadow-none transition-all duration-300">
      <img
        src={member.photo}
        alt={`${member.name} - ${member.role}`}
        className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />

      {/* Overlay informasi anggota */}
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-3.5 sm:bottom-3.5 rounded-[16px] sm:rounded-[18px] bg-white p-3.5 sm:p-4 border border-zinc-100/90 shadow-none flex items-center justify-between gap-3 select-none text-zinc-950">
        <div className="flex flex-col text-left min-w-0 flex-1">
          <span className="text-[15px] sm:text-[16px] font-semibold text-zinc-950 tracking-tight leading-tight truncate">
            {member.name}
          </span>
          <span className="text-[12px] sm:text-[12.5px] text-zinc-500 font-normal leading-tight truncate mt-1">
            {member.role}
          </span>
        </div>

        <a
          href={member.instagramUrl || fallbackInstagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200/90 text-zinc-700 hover:text-[#e1306c] hover:border-[#e1306c]/40 hover:bg-pink-50/40 transition-all duration-200 shrink-0"
          aria-label={`Instagram ${member.name}`}
        >
          <InstagramIcon />
        </a>
      </div>
    </div>
  );
}

