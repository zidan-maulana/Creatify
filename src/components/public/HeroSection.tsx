"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Play, Pause } from "lucide-react";

export function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      if (!videoFrameRef.current) return;
      const rect = videoFrameRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Hitung progress scaling saat container masuk ke dalam viewport
      // Mulai membesar saat menyentuh bagian bawah viewport, dan mencapai skala penuh saat mendekati atas
      const start = windowHeight;
      const end = 80;
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

      // Skala membesar dari 0.66 (kecil saat di awal) hingga 1.0 (hampir memenuhi layar saat di-scroll)
      const scale = 0.66 + progress * 0.34;
      // Corner radius proporsional (44px saat awal, 32px saat membesar penuh)
      const radius = 44 - progress * 12;

      videoFrameRef.current.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      videoFrameRef.current.style.borderRadius = `${radius}px`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#1c62f2] via-[#1655dc] to-[#1047bd] text-white flex flex-col selection:bg-white selection:text-[#1655dc] rounded-b-[40px] sm:rounded-b-[56px] pb-12 sm:pb-16 shadow-[0_20px_50px_rgba(8,30,95,0.10)]"
    >
      {/* Background Lighting & Soft Ambient Glows (Biru Cerah Poster Fasilkom) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top-Left Ambient Spotlight */}
        <div className="absolute -top-32 -left-32 h-[580px] w-[580px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        {/* Top-Right Ambient Spotlight */}
        <div className="absolute -top-32 -right-32 h-[580px] w-[580px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        {/* Center Soft Glow */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] rounded-full bg-[#3078ff]/25 blur-[150px]" />
      </div>

      {/* 1. FLOATING NAVBAR (Pill Shape - Tanpa Shadow & Ramping) */}
      <header className="relative z-30 w-full pt-6 sm:pt-7 px-4 sm:px-6">
        <div className="mx-auto max-w-fit">
          <nav className="relative flex items-center gap-4 sm:gap-7 rounded-full bg-white px-3.5 py-2 sm:pl-6 sm:pr-2.5 sm:py-2.5 border border-white/70 backdrop-blur-md transition-all">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-zinc-950 hover:opacity-90 transition-opacity"
            >
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#185adb] text-white shadow-sm">
                {/* Cobalt-style diamond icon */}
                <div className="h-3.5 w-3.5 rotate-45 rounded-[2px] bg-white flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#185adb]" />
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

            {/* Action Pill Button inside Navbar (Jelajahi Portofolio) */}
            <div className="flex items-center gap-2">
              <Link
                href="/portfolio"
                className="group flex items-center gap-2.5 rounded-full bg-[#185adb] pl-4.5 pr-2 py-2 text-[13.5px] font-medium text-white shadow-sm hover:bg-[#1348b5] transition-all"
              >
                <span>Jelajahi Portofolio</span>
                <span className="relative flex h-[26px] w-[26px] items-center justify-center overflow-hidden rounded-full bg-white text-[#185adb] shadow-sm">
                  {/* Arrow 1 slides out to the right */}
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-300 ease-out group-hover:translate-x-5" />
                  {/* Arrow 2 slides in from the left */}
                  <ArrowRight className="absolute h-3.5 w-3.5 stroke-[2.5] -translate-x-5 transition-transform duration-300 ease-out group-hover:translate-x-0" />
                </span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex h-8.5 w-8.5 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-4.5 w-4.5" />
                ) : (
                  <Menu className="h-4.5 w-4.5" />
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

      {/* 2. HERO MAIN CONTENT (Top-aligned dengan jarak proporsional dan seimbang dari navbar) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-6 pt-9 sm:pt-11 pb-4 sm:pb-6 text-center">
        {/* Status Pill Badge (Identitas Resmi Fakultas) */}
        <div className="inline-flex items-center rounded-full bg-white/12 hover:bg-white/16 backdrop-blur-md px-5 py-2 sm:px-6 sm:py-2.5 transition-all cursor-default">
          <span className="text-[13px] sm:text-[14px] font-normal tracking-normal text-white/95">
            Komunitas Resmi di Bawah Naungan Fakultas Ilmu Komputer
          </span>
        </div>

        {/* Headline: Komposisi presisi seperti referensi (Ketebalan medium 500 lebih ramping, ukuran sedikit diperbesar) */}
        <h1 className="mt-6 sm:mt-7 max-w-5xl xl:max-w-6xl text-[30px] sm:text-[48px] md:text-[58px] lg:text-[70px] xl:text-[74px] font-medium tracking-[-0.03em] text-white leading-[1.1]">
          <span className="block sm:whitespace-nowrap">Desain dan media kreatif yang</span>
          <span className="block sm:whitespace-nowrap">membangun citra fakultas.</span>
        </h1>

        {/* Sub-headline: Persis 2 baris seimbang dengan siluet identik referensi */}
        <p className="mt-5 sm:mt-6 max-w-[540px] text-base sm:text-[17px] font-normal leading-[1.6] text-white/75">
          Studio kreatif independen Fasilkom, merancang karya visual dari <br className="hidden sm:inline" />
          konsep awal hingga publikasi.
        </p>

        {/* Action Buttons: Persis gaya pill Cobalt dengan Arrow Slide Hover Effect */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Primary Action Button (White Pill) */}
          <Link
            href="/join"
            className="group flex w-full sm:w-auto items-center justify-between gap-3.5 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-medium text-zinc-950 shadow-[0_12px_30px_rgba(6,25,80,0.18)] hover:bg-zinc-100 transition-colors duration-200"
          >
            <span>Tertarik Bergabung?</span>
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#185adb] text-white shadow-sm">
              {/* Arrow 1 slides out to the right */}
              <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform duration-300 ease-out group-hover:translate-x-6" />
              {/* Arrow 2 slides in from the left */}
              <ArrowRight className="absolute h-4 w-4 stroke-[2.5] -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0" />
            </span>
          </Link>

          {/* Secondary Action Button (Translucent Pill) */}
          <Link
            href="/about"
            className="group flex w-full sm:w-auto items-center justify-between gap-3.5 rounded-full bg-[#255fdc]/55 hover:bg-[#255fdc]/75 backdrop-blur-md border border-white/20 pl-6 pr-2 py-2 text-[15px] font-medium text-white shadow-sm transition-colors duration-200"
          >
            <span>Tentang Creatify</span>
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white text-[#185adb] shadow-sm">
              {/* Arrow 1 slides out to the right */}
              <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform duration-300 ease-out group-hover:translate-x-6" />
              {/* Arrow 2 slides in from the left */}
              <ArrowRight className="absolute h-4 w-4 stroke-[2.5] -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0" />
            </span>
          </Link>
        </div>

        {/* 3. PARALLAX EXPANDING VIDEO SHOWCASE CONTAINER (Kecil di awal, membesar memenuhi layar saat scroll, tanpa shadow) */}
        <div className="w-full px-1.5 sm:px-3 mt-14 sm:mt-20 mb-2 sm:mb-4 flex justify-center">
          <div
            ref={videoFrameRef}
            style={{
              transform: "scale(0.66)",
              borderRadius: "44px",
              willChange: "transform, border-radius",
              transformOrigin: "center top",
            }}
            className="group relative w-full max-w-[96vw] sm:max-w-[97vw] aspect-video overflow-hidden bg-zinc-950/90 transform-gpu"
          >
            {/* Autoplaying Showcase Video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80"
              className="h-full w-full object-cover"
            >
              <source src="/videos/showcase.mp4" type="video/mp4" />
            </video>

            {/* Subtle Glass Tint Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Floating Play / Pause Control Pill (Hanya Muncul Saat Card Di-hover) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={togglePlayPause}
                className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/95 hover:bg-white text-zinc-950 px-5 py-2.5 text-sm font-medium shadow-[0_12px_36px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 fill-zinc-950" />
                    <span>Pause Video</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-zinc-950 ml-0.5" />
                    <span>Play Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
