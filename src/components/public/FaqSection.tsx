"use client";

import React, { useState } from "react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { SITE_CONFIG } from "@/config/site";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "peran-creatify",
    question: "Apa itu Creatify dan perannya di Fakultas Ilmu Komputer?",
    answer:
      "Creatify adalah komunitas kreatif resmi di bawah naungan Fakultas Ilmu Komputer Universitas Mercu Buana. Kami merancang identitas visual, produksi video sinematik, dan pengelolaan media digital guna memperkuat citra fakultas.",
  },
  {
    id: "layanan-kreatif",
    question: "Karya dan layanan kreatif apa saja yang dikerjakan?",
    answer:
      "Kami mencakup perumusan identitas visual, desain grafis publikasi, produksi video serta aftermovie kegiatan, liputan dokumentasi event kampus, hingga strategi konten media sosial resmi fakultas.",
  },
  {
    id: "pendaftaran-anggota",
    question: "Bagaimana cara mahasiswa bergabung menjadi bagian dari Creatify?",
    answer:
      "Rekrutmen anggota baru dibuka secara berkala pada periode Open Recruitment. Mahasiswa aktif Fakultas Ilmu Komputer dapat mendaftar melalui halaman Rekrutmen dengan melampirkan portofolio sesuai divisi pilihan.",
  },
  {
    id: "kolaborasi-kegiatan",
    question: "Apakah panitia atau organisasi mahasiswa bisa berkolaborasi?",
    answer:
      "Tentu. Kami terbuka untuk berkolaborasi bersama pihak fakultas, program studi, maupun organisasi dan kepanitiaan resmi di lingkungan Fasilkom untuk mendukung kebutuhan visual serta publikasi acara.",
  },
  {
    id: "estimasi-pengerjaan",
    question: "Berapa lama estimasi waktu pengerjaan sebuah proyek?",
    answer:
      "Durasi pengerjaan menyesuaikan kompleksitas kebutuhan, umumnya berkisar tiga hingga tujuh hari kerja untuk materi desain grafis dan satu hingga dua minggu untuk produksi video. Pengajuan ideal dilakukan minimal dua minggu sebelum publikasi.",
  },
  {
    id: "struktur-divisi",
    question: "Divisi apa saja yang ada di dalam tim Creatify?",
    answer:
      "Tim Creatify terdiri dari divisi Visual & Creative, Talent & Content, Research Development, serta Executive Committee yang berkolaborasi dari tahap perencanaan hingga rilisan akhir.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent text-zinc-950 pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-24 md:pb-28 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Kolom kiri: Judul section, pengantar & CTA email */}
          <div className="lg:col-span-4 xl:col-span-4">
            <h2 className="text-[36px] sm:text-[42px] lg:text-[48px] xl:text-[54px] font-medium tracking-[-0.03em] text-[#0c0f1d] leading-[1.08]">
              <span className="block">Yang sering</span>
              <span className="block">ditanyakan</span>
            </h2>

            <p className="mt-4 sm:mt-5 max-w-[330px] text-[14.5px] sm:text-[15px] font-normal leading-[1.6] text-zinc-500">
              Belum menemukan info yang dibutuhkan? Kirim email, tim siap
              membalas cepat.
            </p>

            <div className="mt-6 sm:mt-7">
              <a
                href={SITE_CONFIG.emailHref}
                className="group inline-flex items-center justify-between gap-3.5 rounded-full border border-zinc-200/90 bg-white pl-5 pr-1.5 py-1.5 text-[13.5px] sm:text-[14px] font-medium text-[#0c0f1d] hover:border-zinc-300 hover:bg-zinc-50 transition-colors duration-200 cursor-pointer select-none"
              >
                <span>Email Tim Creatify</span>
                <AnimatedArrowBadge variant="blue" />
              </a>
            </div>
          </div>

          {/* Kolom kanan: Daftar accordion pertanyaan FAQ */}
          <div className="lg:col-span-8 xl:col-span-8 border-t border-b border-zinc-200/80 divide-y divide-zinc-200/80">
            {FAQ_ITEMS.map((item, index) => {
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
                      isOpen ? "pt-5 sm:pt-6 pb-2.5 sm:pb-3" : "py-5 sm:py-6"
                    }`}
                  >
                    <span className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-medium tracking-[-0.015em] leading-[1.4] text-[#0c0f1d]">
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
                      className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
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
                      <p className="pb-5 sm:pb-6 pr-8 sm:pr-12 text-[14.5px] sm:text-[15px] font-normal leading-[1.65] text-zinc-500 max-w-3xl">
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

