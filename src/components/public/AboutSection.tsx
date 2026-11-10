import React from "react";
import Link from "next/link";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="scroll-mt-24 sm:scroll-mt-28 relative w-full bg-transparent text-zinc-950 pt-2 sm:pt-4 md:pt-6 pb-10 sm:pb-12 md:pb-14 px-6 sm:px-10 lg:px-12 xl:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start lg:items-stretch">
          {/* Kolom kiri: Editorial headline dengan visual image pills */}
          <div className="lg:col-span-7 xl:col-span-7">
            <h2 className="flex flex-col gap-1 sm:gap-1.5 text-[26px] sm:text-[30px] md:text-[34px] lg:text-[40px] xl:text-[43px] font-medium tracking-[-0.025em] text-[#0c0f1d] leading-[1.2] sm:leading-[1.18] text-left">
              <span className="block">
                <span>Creatify merupakan tim </span>
                <span className="relative inline-flex items-center justify-center h-[25px] sm:h-[29px] md:h-[32px] lg:h-[36px] xl:h-[39px] w-[52px] sm:w-[60px] md:w-[67px] lg:w-[75px] xl:w-[80px] rounded-full overflow-hidden border border-black/10 bg-zinc-100 shrink-0 align-middle -translate-y-[0.06em] mx-1 sm:mx-1.5 select-none">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=face&w=400&h=200&q=80"
                    alt="Talenta tim kreatif Creatify"
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>kreatif</span>
              </span>

              <span className="block">
                <span>merancang identitas visual</span>
              </span>

              <span className="block">
                <span>hingga media digital </span>
                <span className="relative inline-flex items-center justify-center h-[25px] sm:h-[29px] md:h-[32px] lg:h-[36px] xl:h-[39px] w-[52px] sm:w-[60px] md:w-[67px] lg:w-[75px] xl:w-[80px] rounded-full overflow-hidden border border-black/10 bg-zinc-100 shrink-0 align-middle -translate-y-[0.06em] mx-1 sm:mx-1.5 select-none">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&h=200&q=80"
                    alt="Karya digital dan media kreatif"
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>yang</span>
              </span>

              <span className="block">
                <span>membangun citra fakultas.</span>
              </span>
            </h2>
          </div>

          {/* Kolom kanan: Ringkasan profil & navigasi tim */}
          <div className="lg:col-span-5 xl:col-span-5 pt-0.5 lg:pb-2 flex flex-col justify-between gap-4 text-[14.5px] sm:text-[15px] font-normal leading-[1.65] text-zinc-500 w-full text-left">
            <p>
              Sebagai studio kreatif Fakultas Ilmu Komputer Universitas Mercu Buana,
              kami menghimpun mahasiswa bertalenta untuk merancang desain grafis,
              video sinematik, dan media digital resmi fakultas. Kolaborasi ini
              menjadi ruang eksplorasi guna membangun identitas visual yang solid,
              relevan, serta inspiratif bagi seluruh civitas akademika.
            </p>

            {/* Tombol menuju halaman tim */}
            <div className="pt-0 lg:-translate-y-0.5">
              <Link
                href="/team"
                className="group inline-flex items-center justify-between gap-3.5 rounded-full border border-zinc-200/90 bg-white pl-5 pr-1.5 py-1.5 text-[13.5px] sm:text-[14px] font-medium text-[#0c0f1d] hover:border-zinc-300 hover:bg-zinc-50 transition-colors duration-200 cursor-pointer self-start select-none"
              >
                <span>Lihat Seluruh Tim Creatify</span>
                <AnimatedArrowBadge variant="blue" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
