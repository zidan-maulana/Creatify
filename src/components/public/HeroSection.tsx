"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#1c62f2] via-[#1655dc] to-[#1047bd] text-white flex flex-col justify-between selection:bg-white selection:text-[#1655dc]">
      {/* Background Lighting & Soft Ambient Glows (Inspirasi Biru Cerah Poster Fasilkom) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top-Left Ambient Spotlight */}
        <div className="absolute -top-32 -left-32 h-[580px] w-[580px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        {/* Top-Right Ambient Spotlight */}
        <div className="absolute -top-32 -right-32 h-[580px] w-[580px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        {/* Center Soft Glow */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] rounded-full bg-[#3078ff]/25 blur-[150px]" />
      </div>

      {/* 1. FLOATING NAVBAR (Pill Shape) */}
      <header className="relative z-30 w-full pt-8 sm:pt-10 px-4 sm:px-6">
        <div className="mx-auto max-w-fit">
          <nav className="relative flex items-center gap-5 sm:gap-9 rounded-full bg-white px-3 py-2 sm:pl-6 sm:pr-2 sm:py-2 shadow-[0_14px_36px_rgba(8,30,95,0.22)] border border-white/60 backdrop-blur-md transition-all">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-zinc-950 hover:opacity-90 transition-opacity"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185adb] text-white shadow-sm">
                {/* Cobalt-style diamond icon */}
                <div className="h-3 w-3 rotate-45 rounded-[2px] bg-white flex items-center justify-center">
                  <div className="h-1 w-1 rounded-full bg-[#185adb]" />
                </div>
              </div>
              <span className="text-[16px] font-semibold tracking-tight text-zinc-950">
                Creatify
              </span>
            </Link>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-zinc-600">
              <Link
                href="/portfolio"
                className="hover:text-zinc-950 transition-colors"
              >
                Karya
              </Link>
              <Link
                href="/about"
                className="hover:text-zinc-950 transition-colors"
              >
                Tentang
              </Link>
              <Link
                href="/join"
                className="hover:text-zinc-950 transition-colors"
              >
                Rekrutmen
              </Link>
              <Link
                href="/contact"
                className="hover:text-zinc-950 transition-colors"
              >
                Kontak
              </Link>
            </div>

            {/* Action Pill Button inside Navbar */}
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="group flex items-center gap-2.5 rounded-full bg-[#185adb] pl-4 pr-1.5 py-1.5 text-[13.5px] font-medium text-white shadow-sm hover:bg-[#1348b5] transition-all"
              >
                <span>Mulai Proyek</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#185adb] transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
                  <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                </span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Mobile Dropdown Panel */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl bg-white p-4 shadow-2xl md:hidden text-zinc-800 flex flex-col gap-2 border border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50"
                >
                  Karya Portofolio
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50"
                >
                  Tentang Creatify
                </Link>
                <Link
                  href="/join"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50"
                >
                  Informasi Rekrutmen
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50"
                >
                  Kontak Resmi
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 2. HERO MAIN CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-14 sm:py-16 text-center">
        {/* Status Pill Badge with 3 Overlapping Avatars */}
        <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 pl-2 pr-3.5 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all cursor-default">
          <div className="flex -space-x-1.5 items-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80"
              alt="Tim 1"
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover ring-1.5 ring-white/80 shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80"
              alt="Tim 2"
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover ring-1.5 ring-white/80 shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80"
              alt="Tim 3"
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover ring-1.5 ring-white/80 shadow-sm"
            />
          </div>
          <span className="text-[12.5px] sm:text-[13px] font-normal tracking-normal text-white/95">
            Tersedia untuk kolaborasi dan proyek kreatif 2026/2027
          </span>
        </div>

        {/* Headline: Persis dengan ketebalan dan font referensi */}
        <h1 className="mt-7 sm:mt-8 max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-semibold tracking-[-0.035em] text-white leading-[1.08]">
          Desain dan media kreatif yang <br className="hidden sm:inline" />
          menggerakkan citra fakultas.
        </h1>

        {/* Sub-headline: Ringan, seimbang, dan terpusat */}
        <p className="mt-5 sm:mt-6 max-w-[560px] text-base sm:text-[17px] font-normal leading-relaxed text-white/75">
          Tim kreatif independen di lingkungan Fasilkom, merancang identitas visual,
          media sosial, dan video berkualitas dari konsep awal hingga publikasi.
        </p>

        {/* Action Buttons: Persis gaya pill Cobalt */}
        <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Primary Action Button (White Pill) */}
          <Link
            href="/portfolio"
            className="group flex w-full sm:w-auto items-center justify-between gap-3.5 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-medium text-zinc-950 shadow-[0_14px_36px_rgba(6,25,80,0.22)] hover:bg-zinc-50 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span>Jelajahi Portofolio</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#185adb] text-white transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </span>
          </Link>

          {/* Secondary Action Button (Translucent Pill) */}
          <Link
            href="/about"
            className="group flex w-full sm:w-auto items-center justify-between gap-3.5 rounded-full bg-[#255fdc]/55 hover:bg-[#255fdc]/75 backdrop-blur-md border border-white/20 pl-6 pr-2 py-2 text-[15px] font-medium text-white shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span>Tentang Creatify</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#185adb] transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </span>
          </Link>
        </div>
      </div>

      {/* 3. SUBTLE FOOTER TAGLINE (Breathing Space) */}
      <footer className="relative z-10 pb-8 sm:pb-9 text-center">
        <p className="text-[11px] sm:text-xs tracking-wider text-blue-200/50 uppercase font-medium">
          Fakultas Ilmu Komputer &bull; Universitas Mercu Buana
        </p>
      </footer>
    </section>
  );
}
