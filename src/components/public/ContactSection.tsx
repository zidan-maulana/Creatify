"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SITE_CONFIG } from "@/config/site";

const DIVISION_OPTIONS = [
  {
    id: "visual-creative",
    label: "Visual & Creative",
    description: "Desain Grafis, Branding & Ilustrasi",
  },
  {
    id: "talent-content",
    label: "Talent & Content",
    description: "Produksi Video, Fotografi & Media Sosial",
  },
  {
    id: "research-development",
    label: "Research Development",
    description: "Riset Tren, Konsep & Strategi Konten",
  },
] as const;

const FOOTER_SECTION_LINKS = [
  { label: "Tentang", id: "tentang" },
  { label: "Divisi", id: "divisi" },
  { label: "Karya Kami", id: "karya" },
] as const;

const FOOTER_SOCIAL_LINKS = [
  { label: "Instagram", href: SITE_CONFIG.instagramUrl },
  { label: "TikTok", href: SITE_CONFIG.tiktokUrl },
  { label: "YouTube", href: SITE_CONFIG.youtubeUrl },
] as const;

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [divisionError, setDivisionError] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    division: string;
    mailtoHref: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const activeDivision = DIVISION_OPTIONS.find(
    (opt) => opt.id === selectedDivision
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      mailtoHref: `${SITE_CONFIG.emailHref}?subject=${subject}&body=${body}`,
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
      className="scroll-mt-0 relative w-full bg-[#185adb] text-white pt-24 sm:pt-28 pb-10 sm:pb-12 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      {/* Anchor target untuk navigasi rekrutmen & kontak */}
      <div
        id="rekrutmen"
        className="scroll-mt-24 sm:scroll-mt-28 mx-auto max-w-[1360px]"
      >
        {/* Bagian atas: Info kontak & form pendaftaran rekrutmen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-16 items-start">
          {/* Kolom kiri: Judul section, pengantar & kanal kontak resmi */}
          <div className="lg:col-span-5 xl:col-span-5 pt-1">
            <h2 className="text-[38px] sm:text-[46px] lg:text-[52px] xl:text-[56px] font-medium tracking-[-0.03em] leading-[1.06] text-white">
              <span className="block">Mari berkarya</span>
              <span className="block">bersama Creatify</span>
            </h2>

            <p className="mt-5 max-w-[380px] text-[14px] sm:text-[15px] font-normal leading-[1.6] text-white/80">
              Ceritakan minat kreatif Anda. Tim kami meninjau setiap pendaftaran
              masuk.
            </p>

            {/* Detail kanal resmi Creatify */}
            <div className="mt-9 sm:mt-10 space-y-5">
              <div>
                <span className="block text-[12px] sm:text-[12.5px] font-normal text-white/65">
                  Email
                </span>
                <a
                  href={SITE_CONFIG.emailHref}
                  className="mt-1 inline-block text-[20px] sm:text-[23px] font-medium tracking-[-0.02em] text-white hover:text-white/85 transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>

              <div>
                <span className="block text-[12px] sm:text-[12.5px] font-normal text-white/65">
                  Instagram
                </span>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[20px] sm:text-[23px] font-medium tracking-[-0.02em] text-white hover:text-white/85 transition-colors"
                >
                  {SITE_CONFIG.instagramHandle}
                </a>
              </div>

              <div>
                <span className="block text-[12px] sm:text-[12.5px] font-normal text-white/65">
                  Sekretariat
                </span>
                <p className="mt-1 text-[20px] sm:text-[23px] font-medium tracking-[-0.02em] text-white">
                  {SITE_CONFIG.secretariat.shortLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Kolom kanan: Card formulir rekrutmen anggota */}
          <div className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7 xl:max-w-[620px] xl:ml-auto w-full">
            <div className="w-full rounded-[24px] sm:rounded-[28px] bg-white text-[#0c0f1d] p-6 sm:p-8">
              {submittedData ? (
                <div className="py-6 sm:py-8 flex flex-col items-start text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#185adb]/10 text-[#185adb]">
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <h3 className="mt-5 text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
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

                  <div className="mt-7 flex flex-wrap items-center gap-3 w-full">
                    <a
                      href={submittedData.mailtoHref}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center rounded-full bg-[#185adb] hover:bg-[#1348b5] text-white py-2.5 px-6 text-[13.5px] sm:text-[14px] font-medium transition-colors"
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
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                      aria-expanded={isDropdownOpen}
                      aria-labelledby="division-label"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between gap-3 rounded-[10px] border px-3.5 py-2.5 text-left text-[13.5px] transition-colors cursor-pointer select-none ${
                        divisionError
                          ? "border-red-400 bg-red-50/40 text-[#0c0f1d]"
                          : isDropdownOpen
                          ? "border-[#185adb] bg-white text-[#0c0f1d]"
                          : "border-zinc-200/80 bg-[#f4f5f7] hover:bg-zinc-100/80 text-[#0c0f1d]"
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
                          isDropdownOpen ? "rotate-180 text-[#185adb]" : ""
                        }`}
                      />
                    </button>

                    {divisionError && (
                      <p className="mt-1.5 text-[12px] text-red-500">
                        Silakan pilih salah satu divisi terlebih dahulu.
                      </p>
                    )}

                    {isDropdownOpen && (
                      <div
                        role="listbox"
                        aria-labelledby="division-label"
                        className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-[12px] border border-zinc-200 bg-white p-1.5 shadow-[0_10px_28px_rgba(12,15,29,0.08)]"
                      >
                        {DIVISION_OPTIONS.map((option) => {
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

                  {/* Tombol kirim pendaftaran tanpa ikon panah */}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#185adb] hover:bg-[#1348b5] text-white py-3 px-6 text-[13.5px] sm:text-[14px] font-medium transition-colors duration-200 cursor-pointer select-none"
                  >
                    Kirim Pendaftaran
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Garis pemisah footer */}
        <div
          id="footer"
          className="scroll-mt-24 sm:scroll-mt-28 mt-16 sm:mt-20 pt-12 sm:pt-14 border-t border-white/15"
        >
          {/* Kolom navigasi & informasi footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Kolom 1: Brand Creatify */}
            <div className="sm:col-span-2 lg:col-span-5">
              <BrandLogo variant="white" />

              <p className="mt-4 max-w-[265px] text-[13.5px] font-normal leading-[1.6] text-white/75">
                Komunitas kreatif Fakultas Ilmu Komputer Universitas Mercu Buana
                untuk identitas visual dan media publikasi digital.
              </p>
            </div>

            {/* Kolom 2: Navigasi halaman */}
            <div className="lg:col-span-2">
              <h3 className="text-[12px] font-normal text-white/60 mb-3.5">
                Halaman
              </h3>
              <ul className="space-y-2 text-[13.5px] sm:text-[14px] font-medium text-white">
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
              <h3 className="text-[12px] font-normal text-white/60 mb-3.5">
                Media Sosial
              </h3>
              <ul className="space-y-2 text-[13.5px] sm:text-[14px] font-medium text-white">
                {FOOTER_SOCIAL_LINKS.map((social) => (
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
              <h3 className="text-[12px] font-normal text-white/60 mb-3.5">
                Sekretariat
              </h3>
              <p className="text-[13.5px] sm:text-[14px] font-medium leading-[1.6] text-white">
                {SITE_CONFIG.secretariat.faculty}
                <br />
                {SITE_CONFIG.secretariat.address}
              </p>
              <a
                href={SITE_CONFIG.emailHref}
                className="mt-3 inline-block text-[13.5px] sm:text-[14px] font-medium text-white hover:text-white/75 transition-colors"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>

          {/* Baris hak cipta & tombol kembali ke atas */}
          <div className="mt-14 sm:mt-16 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/70">
            <p>© 2026 Creatify Fasilkom. Seluruh hak cipta dilindungi.</p>

            <p>Fakultas Ilmu Komputer UMB</p>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center justify-between gap-3 rounded-full bg-white pl-5 pr-2 py-2 text-[13.5px] sm:text-[14px] font-medium text-zinc-950 hover:bg-zinc-100 transition-colors duration-200 cursor-pointer select-none"
            >
              <span>Kembali ke atas</span>
              <AnimatedArrowBadge direction="up" variant="blue" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
