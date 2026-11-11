"use client";

import { useState, useRef, useId, type FormEvent } from "react";
import Link from "next/link";
import { ChevronDown, Check, LockKeyhole } from "lucide-react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useDismissableLayers } from "@/hooks/useDismissableLayer";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
} from "@/config/landing-cms";
import type { ContactSectionContent, SiteSettingsContent } from "@/types/cms";

const FOOTER_SECTION_LINKS = [
  { label: "Tentang", id: "tentang" },
  { label: "Divisi", id: "divisi" },
  { label: "Karya Kami", id: "karya" },
] as const;

interface ContactSectionProps {
  content?: ContactSectionContent;
  siteSettings?: SiteSettingsContent;
}

export function ContactSection({
  content = DEFAULT_LANDING_CONTENT.contact,
  siteSettings = DEFAULT_SITE_SETTINGS,
}: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [divisionError, setDivisionError] = useState(false);
  const [isClosedNoticeVisible, setIsClosedNoticeVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    division: string;
    mailtoHref: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const lockedCardRef = useRef<HTMLDivElement>(null);
  const lockBodyGradId = useId();
  const isLocked = !content.isRecruitmentOpen;
  const showClosedModal = isLocked && isClosedNoticeVisible;
  const effectiveDropdownOpen = !isLocked && isDropdownOpen;
  const emailHref = `mailto:${siteSettings.email}`;
  const footerSocialLinks = [
    { label: "Instagram", href: siteSettings.instagramUrl },
    { label: "TikTok", href: siteSettings.tiktokUrl },
    { label: "YouTube", href: siteSettings.youtubeUrl },
  ];

  useDismissableLayers([
    {
      ref: dropdownRef,
      enabled: effectiveDropdownOpen,
      onDismiss: () => setIsDropdownOpen(false),
    },
    {
      ref: lockedCardRef,
      enabled: showClosedModal,
      onDismiss: () => setIsClosedNoticeVisible(false),
    },
  ]);

  const activeDivision = content.divisionOptions.find(
    (opt) => opt.id === selectedDivision
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.isRecruitmentOpen) return;

    if (!activeDivision) {
      setDivisionError(true);
      setIsDropdownOpen(true);
      return;
    }

    const subject = encodeURIComponent(
      `[Open Recruitment - ${activeDivision.label}] ${name}`
    );
    const body = encodeURIComponent(
      `Nama: ${name}\nEmail: ${email}\nProgram Studi & Angkatan: ${major || "-"}\nDivisi Pilihan: ${activeDivision.label}\n\nMotivasi & Portofolio:\n${message}`
    );

    setSubmittedData({
      name,
      division: activeDivision.label,
      mailtoHref: `${emailHref}?subject=${subject}&body=${body}`,
    });
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMajor("");
    setSelectedDivision("");
    setMessage("");
    setDivisionError(false);
    setSubmittedData(null);
  };

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      id="kontak"
      className="scroll-mt-0 relative w-full bg-[#185adb] text-white pt-16 sm:pt-28 pb-8 sm:pb-12 px-4 min-[400px]:px-5 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      {/* Anchor target untuk navigasi rekrutmen & kontak */}
      <div
        id="rekrutmen"
        className="scroll-mt-24 sm:scroll-mt-28 mx-auto max-w-[1360px]"
      >
        {/* Bagian atas: Info kontak & form pendaftaran rekrutmen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 sm:gap-12 lg:gap-8 xl:gap-12 items-start">
          {/* Kolom kiri: Judul section, pengantar & kanal kontak resmi */}
          <ScrollReveal duration={500} distance={24} className="lg:col-span-6 xl:col-span-6 pt-1">
            <h2 className="text-[34px] min-[400px]:text-[38px] sm:text-[50px] lg:text-[56px] xl:text-[64px] font-medium tracking-[-0.03em] leading-[1.08] sm:leading-[1.06] text-white">
              <span className="block">{content.titleLine1}</span>
              <span className="block sm:whitespace-nowrap">{content.titleLine2}</span>
            </h2>

            <p className="mt-4 sm:mt-6 max-w-[440px] text-[14.5px] sm:text-[16.5px] lg:text-[17.5px] font-normal leading-[1.6] text-white/80">
              {content.subtitle}
            </p>

            {/* Detail kanal resmi Creatify */}
            <div className="mt-7 sm:mt-10 space-y-4 sm:space-y-6">
              <div>
                <span className="block text-[12.5px] sm:text-[14px] font-normal text-white/65">
                  Email
                </span>
                <a
                  href={emailHref}
                  className="mt-0.5 sm:mt-1 inline-block max-w-full break-all sm:break-normal text-[17.5px] min-[400px]:text-[20px] sm:text-[25px] lg:text-[26px] font-medium tracking-[-0.02em] text-white hover:text-white/85 transition-colors"
                >
                  {siteSettings.email}
                </a>
              </div>

              <div>
                <span className="block text-[12.5px] sm:text-[14px] font-normal text-white/65">
                  Instagram
                </span>
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 sm:mt-1 inline-block max-w-full break-words text-[17.5px] min-[400px]:text-[20px] sm:text-[25px] lg:text-[26px] font-medium tracking-[-0.02em] text-white hover:text-white/85 transition-colors"
                >
                  {siteSettings.instagramHandle}
                </a>
              </div>

              <div>
                <span className="block text-[12.5px] sm:text-[14px] font-normal text-white/65">
                  Sekretariat
                </span>
                <p className="mt-0.5 sm:mt-1 text-[17.5px] min-[400px]:text-[20px] sm:text-[25px] lg:text-[26px] font-medium tracking-[-0.02em] text-white">
                  {siteSettings.secretariat.shortLabel}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Kolom kanan: Card formulir rekrutmen anggota */}
          <ScrollReveal
            delay={75}
            duration={480}
            distance={24}
            className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7 xl:max-w-[620px] xl:ml-auto w-full"
          >
            <div
              ref={lockedCardRef}
              tabIndex={isLocked ? 0 : undefined}
              aria-label={
                isLocked
                  ? "Formulir pendaftaran open recruitment sedang ditutup"
                  : undefined
              }
              onMouseEnter={() => {
                if (isLocked) setIsClosedNoticeVisible(true);
              }}
              onMouseLeave={() => {
                if (isLocked) setIsClosedNoticeVisible(false);
              }}
              onClick={() => {
                if (isLocked) setIsClosedNoticeVisible(true);
              }}
              onFocus={() => {
                if (isLocked) setIsClosedNoticeVisible(true);
              }}
              onBlur={(e) => {
                if (
                  isLocked &&
                  !e.currentTarget.contains(e.relatedTarget as Node | null)
                ) {
                  setIsClosedNoticeVisible(false);
                }
              }}
              className={`relative w-full rounded-[22px] sm:rounded-[28px] bg-white text-[#0c0f1d] p-5 sm:p-8 ${
                isLocked
                  ? "overflow-hidden cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  : ""
              }`}
            >
              {!isLocked && submittedData ? (
                <div className="py-4 sm:py-8 flex flex-col items-start text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#185adb]/10 text-[#185adb]">
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <h3 className="mt-5 text-[19px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
                    Pendaftaran siap dikirim, {submittedData.name}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.6] text-zinc-500">
                    Pengajuan untuk divisi{" "}
                    <span className="font-medium text-[#0c0f1d]">
                      {submittedData.division}
                    </span>{" "}
                    telah terformat. Lanjutkan pengiriman melalui aplikasi email
                    Anda atau isi ulang formulir.
                  </p>

                  <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
                    <a
                      href={submittedData.mailtoHref}
                      className="inline-flex items-center justify-center rounded-full bg-[#185adb] hover:bg-[#1348b5] text-white py-2.5 px-6 text-[13.5px] sm:text-[14px] font-medium transition-colors"
                    >
                      Buka Aplikasi Email
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-5 py-2.5 text-[13.5px] sm:text-[14px] font-medium text-[#0c0f1d] transition-colors cursor-pointer"
                    >
                      Daftar Ulang
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <fieldset
                    disabled={isLocked}
                    aria-disabled={isLocked}
                    className={`min-w-0 border-0 p-0 m-0 space-y-4 sm:space-y-5 transition-opacity duration-200 ${
                      isLocked
                        ? showClosedModal
                          ? "pointer-events-none select-none opacity-20"
                          : "pointer-events-none select-none opacity-55"
                        : ""
                    }`}
                  >
                    {/* Baris nama & email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="recruit-name"
                          className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
                        >
                          Nama
                        </label>
                        <input
                          id="recruit-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className="w-full rounded-[10px] border border-zinc-200/80 bg-[#f4f5f7] px-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="recruit-email"
                          className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
                        >
                          Email
                        </label>
                        <input
                          id="recruit-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@mercubuana.ac.id"
                          className="w-full rounded-[10px] border border-zinc-200/80 bg-[#f4f5f7] px-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Baris program studi & angkatan */}
                    <div>
                      <label
                        htmlFor="recruit-major"
                        className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
                      >
                        Program Studi &amp; Angkatan
                      </label>
                      <input
                        id="recruit-major"
                        type="text"
                        required
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Contoh: Teknik Informatika — 2024"
                        className="w-full rounded-[10px] border border-zinc-200/80 bg-[#f4f5f7] px-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Dropdown pilihan divisi */}
                    <div ref={dropdownRef} className="relative">
                      <span
                        id="division-label"
                        className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
                      >
                        Divisi Pilihan
                      </span>
                      <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={effectiveDropdownOpen}
                        aria-labelledby="division-label"
                        onClick={() => {
                          if (!isLocked) setIsDropdownOpen((prev) => !prev);
                        }}
                        className={`w-full flex items-center justify-between gap-3 rounded-[10px] border px-3.5 py-2.5 text-left text-[13.5px] transition-colors select-none ${
                          isLocked
                            ? "border-zinc-200/80 bg-[#f4f5f7] text-[#0c0f1d] cursor-not-allowed"
                            : divisionError
                            ? "border-red-400 bg-red-50/40 text-[#0c0f1d] cursor-pointer"
                            : effectiveDropdownOpen
                            ? "border-[#185adb] bg-white text-[#0c0f1d] cursor-pointer"
                            : "border-zinc-200/80 bg-[#f4f5f7] hover:bg-zinc-100/80 text-[#0c0f1d] cursor-pointer"
                        }`}
                      >
                        <span
                          className={
                            activeDivision ? "text-[#0c0f1d]" : "text-zinc-400"
                          }
                        >
                          {activeDivision
                            ? activeDivision.label
                            : "Pilih divisi yang diminati"}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                            effectiveDropdownOpen
                              ? "rotate-180 text-[#185adb]"
                              : ""
                          }`}
                        />
                      </button>

                      {divisionError && !isLocked && (
                        <p className="mt-1.5 text-[12px] text-red-500">
                          Silakan pilih salah satu divisi terlebih dahulu.
                        </p>
                      )}

                      {effectiveDropdownOpen && (
                        <div
                          role="listbox"
                          aria-labelledby="division-label"
                          className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-[240px] overflow-y-auto rounded-[12px] border border-zinc-200 bg-white p-1.5 shadow-[0_10px_28px_rgba(12,15,29,0.08)]"
                        >
                          {content.divisionOptions.map((option) => {
                            const isSelected = selectedDivision === option.id;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setSelectedDivision(option.id);
                                  setDivisionError(false);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-[#185adb]/[0.07] text-[#185adb]"
                                    : "text-[#0c0f1d] hover:bg-zinc-50"
                                }`}
                              >
                                <div className="min-w-0">
                                  <span className="block text-[13.5px] font-medium leading-snug">
                                    {option.label}
                                  </span>
                                  <span className="block text-[11.5px] text-zinc-500 truncate mt-0.5">
                                    {option.description}
                                  </span>
                                </div>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-[#185adb] shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Alasan bergabung & tautan portofolio */}
                    <div>
                      <label
                        htmlFor="recruit-message"
                        className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
                      >
                        Portofolio &amp; Alasan Bergabung
                      </label>
                      <textarea
                        id="recruit-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ceritakan pengalaman kreatif Anda serta cantumkan tautan portofolio (Google Drive, Behance, atau Instagram)..."
                        className="w-full resize-none rounded-[10px] border border-zinc-200/80 bg-[#f4f5f7] px-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Tombol kirim pendaftaran */}
                    <button
                      type="submit"
                      disabled={isLocked}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3 px-6 text-[13.5px] sm:text-[14px] font-medium transition-colors duration-200 select-none ${
                        isLocked
                          ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                          : "bg-[#185adb] hover:bg-[#1348b5] text-white cursor-pointer"
                      }`}
                    >
                      {isLocked && <LockKeyhole className="h-3.5 w-3.5 shrink-0" />}
                      <span>{content.submitLabel}</span>
                    </button>
                  </fieldset>
                </form>
              )}

              {/* Keterangan penutupan rekrutmen langsung pada card utama saat di-hover */}
              {isLocked && (
                <div
                  role="dialog"
                  aria-modal="false"
                  aria-hidden={!showClosedModal}
                  aria-labelledby="recruitment-closed-title"
                  className={`absolute inset-0 z-20 flex items-center justify-center rounded-[22px] sm:rounded-[28px] bg-white/80 backdrop-blur-[6px] p-6 sm:p-10 transition-opacity duration-200 ease-out ${
                    showClosedModal
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`flex max-w-[450px] flex-col items-center text-center transition-all duration-200 ease-out ${
                      showClosedModal
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-2 scale-[0.98]"
                    }`}
                  >
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      aria-hidden="true"
                      className="h-12 w-12 sm:h-16 sm:w-16 drop-shadow-[0_12px_24px_rgba(24,90,219,0.24)]"
                    >
                      <defs>
                        <linearGradient
                          id={lockBodyGradId}
                          x1="10"
                          y1="20"
                          x2="38"
                          y2="42"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#2b71f8" />
                          <stop offset="100%" stopColor="#144cc2" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M16.5 21V14.5C16.5 10.3579 19.8579 7 24 7C28.1421 7 31.5 10.3579 31.5 14.5V21"
                        stroke="#0c0f1d"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      <rect
                        x="10"
                        y="20"
                        width="28"
                        height="22"
                        rx="6.5"
                        fill={`url(#${lockBodyGradId})`}
                      />
                      <circle cx="24" cy="29.2" r="2.8" fill="#ffffff" />
                      <rect
                        x="22.7"
                        y="30.5"
                        width="2.6"
                        height="6"
                        rx="1.3"
                        fill="#ffffff"
                      />
                    </svg>

                    <h3
                      id="recruitment-closed-title"
                      className="mt-4 sm:mt-5 text-[21px] sm:text-[28px] lg:text-[30px] font-semibold tracking-[-0.025em] leading-[1.15] text-[#0c0f1d]"
                    >
                      Open Recruitment Ditutup
                    </h3>

                    <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[16.5px] leading-[1.6] text-zinc-600">
                      {content.closedNotice}
                    </p>

                    <a
                      href={emailHref}
                      tabIndex={showClosedModal ? undefined : -1}
                      onClick={(e) => e.stopPropagation()}
                      className="group mt-6 sm:mt-7 inline-flex items-center justify-between gap-3.5 rounded-full bg-[#185adb] hover:bg-[#1348b5] pl-5 sm:pl-6 pr-1.5 sm:pr-2 py-1.5 sm:py-2 text-[14px] sm:text-[15px] font-medium text-white transition-colors duration-200 cursor-pointer select-none"
                    >
                      <span>Hubungi via Email</span>
                      <AnimatedArrowBadge variant="white" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Garis pemisah footer */}
        <div
          id="footer"
          className="scroll-mt-24 sm:scroll-mt-28 mt-14 sm:mt-20 pt-10 sm:pt-14 border-t border-white/15"
        >
          {/* Kolom navigasi & informasi footer */}
          <ScrollReveal
            duration={440}
            distance={18}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8"
          >
            {/* Kolom 1: Brand Creatify */}
            <div className="sm:col-span-2 lg:col-span-5">
              <BrandLogo variant="white" label={siteSettings.name} />

              <p className="mt-3.5 sm:mt-4 max-w-[300px] sm:max-w-[265px] text-[14px] sm:text-[13.5px] font-normal leading-[1.6] text-white/80 sm:text-white/75">
                {content.footerDescription}
              </p>
            </div>

            {/* Kolom 2: Navigasi halaman */}
            <div className="lg:col-span-2">
              <h3 className="text-[12.5px] sm:text-[12px] font-normal text-white/65 sm:text-white/60 mb-3 sm:mb-3.5">
                Halaman
              </h3>
              <ul className="space-y-2.5 sm:space-y-2 text-[16px] sm:text-[14px] font-medium text-white">
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-white/75 transition-colors cursor-pointer"
                  >
                    Beranda
                  </button>
                </li>
                {FOOTER_SECTION_LINKS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className="hover:text-white/75 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/team"
                    className="hover:text-white/75 transition-colors"
                  >
                    Tim
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                    className="hover:text-white/75 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Media sosial */}
            <div className="lg:col-span-2">
              <h3 className="text-[12.5px] sm:text-[12px] font-normal text-white/65 sm:text-white/60 mb-3 sm:mb-3.5">
                Media Sosial
              </h3>
              <ul className="space-y-2.5 sm:space-y-2 text-[16px] sm:text-[14px] font-medium text-white">
                {footerSocialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white/75 transition-colors"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4: Sekretariat */}
            <div className="lg:col-span-3">
              <h3 className="text-[12.5px] sm:text-[12px] font-normal text-white/65 sm:text-white/60 mb-3 sm:mb-3.5">
                Sekretariat
              </h3>
              <p className="text-[15.5px] sm:text-[14px] font-medium leading-[1.6] text-white">
                {siteSettings.secretariat.faculty}
                <br />
                {siteSettings.secretariat.address}
              </p>
              <a
                href={emailHref}
                className="mt-3 inline-block max-w-full break-words text-[15.5px] sm:text-[14px] font-medium text-white hover:text-white/75 transition-colors"
              >
                {siteSettings.email}
              </a>
            </div>
          </ScrollReveal>

          {/* Baris hak cipta & tombol kembali ke atas */}
          <ScrollReveal
            delay={60}
            duration={400}
            distance={14}
            className="mt-10 sm:mt-16 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 text-[12px] text-white/70 text-left"
          >
            <p>{content.copyrightText}</p>

            <p>{content.facultyLabel}</p>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center justify-between gap-3 rounded-full bg-white pl-5 pr-1.5 sm:pr-2 py-1.5 sm:py-2 text-[13.5px] sm:text-[14px] font-medium text-zinc-950 hover:bg-zinc-100 transition-colors duration-200 cursor-pointer select-none"
            >
              <span>Kembali ke atas</span>
              <AnimatedArrowBadge direction="up" variant="blue" />
            </button>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}
