"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#185adb] via-[#1450cb] to-[#0f3ea8] text-white flex flex-col justify-between selection:bg-white selection:text-[#1450cb]">
      {/* Background Ambient Spotlights (Inspirasi dari poster biru cerah Fasilkom) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Left Spotlight Glow */}
        <div className="absolute -top-24 -left-24 h-[600px] w-[600px] rounded-full bg-[#4086ff]/35 blur-[140px]" />
        {/* Top Right Spotlight Glow */}
        <div className="absolute -top-24 -right-24 h-[600px] w-[600px] rounded-full bg-[#4086ff]/35 blur-[140px]" />
        {/* Center Glow */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-[#276ef5]/25 blur-[160px]" />
        {/* Subtle Watermark/Noise Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* 1. FLOATING NAVBAR (Pill Shape) */}
      <header className="relative z-30 w-full pt-7 sm:pt-9 px-4 sm:px-6">
        <div className="mx-auto max-w-fit">
          <nav className="relative flex items-center gap-4 sm:gap-10 rounded-full bg-white px-3 py-2 sm:pl-6 sm:pr-2.5 sm:py-2.5 shadow-[0_16px_40px_rgba(8,30,95,0.28)] border border-white/50 backdrop-blur-md transition-all">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-zinc-950 hover:opacity-90 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#185adb] text-white shadow-sm">
                {/* Cobalt-style diamond icon */}
                <div className="h-3.5 w-3.5 rotate-45 rounded-[2px] bg-white flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#185adb]" />
                </div>
              </div>
              <span className="text-[17px] font-bold tracking-tight text-zinc-950">
                Creatify
              </span>
            </Link>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-zinc-600">
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

            {/* Action Pill Button */}
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="group flex items-center gap-2.5 rounded-full bg-[#185adb] pl-4 pr-1.5 py-1.5 text-[13px] sm:text-[14px] font-medium text-white shadow-sm hover:bg-[#1348b5] transition-all"
              >
                <span>Mulai Proyek</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#185adb] transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </Link>

              {/* Mobile Menu Button */}
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

            {/* Mobile Dropdown Menu */}
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

      {/* 2. HERO CONTENT (Main Center Area) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 text-center">
        {/* Status Pill Badge with 3 Overlapping User Avatars */}
        <div className="inline-flex items-center gap-3 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 pl-2 pr-4 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all cursor-default">
          <div className="flex -space-x-2 items-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=72&h=72&q=80"
              alt="Anggota Creatify 1"
              className="h-6 w-6 rounded-full object-cover ring-2 ring-white/80 shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=72&h=72&q=80"
              alt="Anggota Creatify 2"
              className="h-6 w-6 rounded-full object-cover ring-2 ring-white/80 shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=72&h=72&q=80"
              alt="Anggota Creatify 3"
              className="h-6 w-6 rounded-full object-cover ring-2 ring-white/80 shadow-sm"
            />
          </div>
          <span className="text-xs sm:text-[13px] font-medium tracking-tight text-white/95">
            Tersedia untuk kolaborasi dan proyek kreatif 2026/2027
          </span>
        </div>

        {/* Huge Bold Headline - Cadence mirrors "Brands and websites that help companies grow." */}
        <h1 className="mt-8 sm:mt-10 max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-bold tracking-[-0.03em] text-white leading-[1.08]">
          Desain dan media kreatif yang <br className="hidden sm:inline" />
          menggerakkan citra fakultas.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 sm:mt-7 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-blue-100/85">
          Tim kreatif independen di lingkungan Fasilkom, merancang identitas visual,
          media sosial, dan video berkualitas dari konsep awal hingga publikasi.
        </p>

        {/* Bottom Dual Action Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          {/* Primary Action Button (White Pill) */}
          <Link
            href="/portfolio"
            className="group flex w-full sm:w-auto items-center justify-between gap-4 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_36px_rgba(6,25,80,0.22)] hover:bg-zinc-50 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span>Jelajahi Portofolio</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#185adb] text-white transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </span>
          </Link>

          {/* Secondary Action Button (Translucent Pill) */}
          <Link
            href="/about"
            className="group flex w-full sm:w-auto items-center justify-between gap-4 rounded-full bg-white/15 backdrop-blur-md border border-white/25 pl-6 pr-2 py-2 text-[15px] font-semibold text-white shadow-sm hover:bg-white/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span>Tentang Creatify</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#185adb] transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </span>
          </Link>
        </div>
      </div>

      {/* 3. SUBTLE FOOTER TAGLINE (Breathing Space) */}
      <footer className="relative z-10 pb-7 sm:pb-9 text-center">
        <p className="text-[11px] sm:text-xs tracking-wider text-blue-200/60 uppercase font-medium">
          Fakultas Ilmu Komputer &bull; Universitas Mercu Buana
        </p>
      </footer>
    </section>
  );
}
