"use client";

import { Fragment, useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { DIVISION_OPTIONS, DivisionId, TeamMember } from "@/data/team";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useDismissableLayers } from "@/hooks/useDismissableLayer";
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
  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const divisionDropdownRef = useRef<HTMLDivElement>(null);

  useDismissableLayers([
    {
      ref: divisionDropdownRef,
      enabled: isDivisionDropdownOpen,
      onDismiss: () => setIsDivisionDropdownOpen(false),
    },
  ]);

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

  const activeDivisionOption =
    DIVISION_OPTIONS.find((opt) => opt.id === selectedDivision) ??
    DIVISION_OPTIONS[0];

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
      <div className="h-[76px] md:h-20 w-full shrink-0" aria-hidden="true" />

      {/* Header section halaman tim */}
      <section className="relative z-20 pt-8 min-[390px]:pt-9 sm:pt-12 md:pt-16 pb-6 sm:pb-10 px-4 min-[400px]:px-5 sm:px-10 lg:px-12 xl:px-14 text-center w-full max-w-[1360px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[29px] min-[400px]:text-[33px] sm:text-[42px] md:text-[50px] lg:text-[54px] font-medium tracking-[-0.03em] text-zinc-950 leading-[1.15]">
            <span className="block">{content.titleLine1}</span>
            <span className="block">{content.titleLine2}</span>
          </h1>

          <p className="mt-3 sm:mt-4 max-w-xl mx-auto text-[14px] sm:text-[16px] font-normal leading-[1.55] text-zinc-600 sm:whitespace-pre-line">
            {content.subtitle}
          </p>
        </div>

        {/* Dropdown filter divisi tim khusus mobile */}
        <div
          ref={divisionDropdownRef}
          className="md:hidden relative mt-6 w-full max-w-[460px] mx-auto text-left"
        >
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isDivisionDropdownOpen}
            aria-label="Filter divisi tim Creatify"
            onClick={() => setIsDivisionDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-3 rounded-full border border-zinc-200/90 bg-white pl-5 pr-2 py-2 text-left text-[14.5px] font-medium text-zinc-950 shadow-[0_2px_10px_rgba(12,15,29,0.04)] hover:border-zinc-300 hover:bg-zinc-50/70 transition-colors cursor-pointer select-none"
          >
            <span className="truncate">{activeDivisionOption.badge}</span>
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-[#185adb] text-white shrink-0">
              <ChevronDown
                className={`h-4 w-4 stroke-[2.2] transition-transform duration-200 ${
                  isDivisionDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          <div
            role="listbox"
            aria-hidden={!isDivisionDropdownOpen}
            aria-label="Pilih divisi tim Creatify"
            className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-2xl border border-zinc-200/85 bg-white p-1.5 text-zinc-950 shadow-[0_14px_34px_rgba(12,15,29,0.12)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isDivisionDropdownOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-[0.98] -translate-y-1.5 pointer-events-none"
            }`}
          >
            {DIVISION_OPTIONS.map((opt) => {
              const isSelected = selectedDivision === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  tabIndex={isDivisionDropdownOpen ? undefined : -1}
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedDivision(opt.id);
                    setIsDivisionDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13.5px] transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#185adb]/10 font-semibold text-[#185adb]"
                      : "font-medium text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <span className="truncate">{opt.badge}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-[#185adb] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Badge filter divisi tim (desktop) */}
        <div
          role="tablist"
          aria-label="Filter divisi tim Creatify"
          className="hidden md:block mt-8 w-full max-w-5xl mx-auto overflow-x-auto no-scrollbar px-4 py-1"
        >
          <div className="w-fit min-w-max mx-auto flex items-center gap-2 md:gap-2.5">
            {DIVISION_OPTIONS.map((opt) => {
              const isSelected = selectedDivision === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDivision(opt.id)}
                  className={`group inline-flex items-center px-4 md:px-4.5 py-2 rounded-full text-[13px] md:text-[13.5px] font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0 ${
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
              <Fragment key={member.id}>
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
              </Fragment>
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

