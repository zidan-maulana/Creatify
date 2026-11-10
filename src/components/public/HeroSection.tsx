"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { PublicNavbar, LandingSectionId } from "@/components/public/PublicNavbar";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const footerActiveModeRef = useRef<"rekrutmen" | "kontak">("rekrutmen");
  const lastFooterNavClickRef = useRef<number>(0);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
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

  const handleNavigateSection = (sectionId: LandingSectionId) => {
    if (sectionId === "beranda") {
      setActiveSection("beranda");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (
      sectionId === "rekrutmen" ||
      sectionId === "kontak" ||
      sectionId === "footer"
    ) {
      const activeMode = sectionId === "rekrutmen" ? "rekrutmen" : "kontak";
      lastFooterNavClickRef.current = Date.now();
      footerActiveModeRef.current = activeMode;
      setActiveSection(activeMode);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (sectionId === "tentang") {
      setActiveSection("tentang");
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let ticking = false;
    let lastScale = -1;
    let lastEase = -1;
    let lastScrolled: boolean | null = null;
    let lastActive = "";

    const updateParallax = () => {
      if (!videoContainerRef.current || !videoFrameRef.current) {
        ticking = false;
        return;
      }

      const rect = videoContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Skala frame video berdasarkan posisi scroll (0.70 sampai 1.0)
      const start = windowHeight;
      const end = 60;
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      const scale = Number((0.7 + progress * 0.3).toFixed(4));

      if (scale !== lastScale) {
        videoFrameRef.current.style.transform = `scale3d(${scale}, ${scale}, 1)`;
        lastScale = scale;
      }

      // Interpolasi warna kanvas biru ke putih saat scroll melewati hero
      const transitionDistance = 520;
      const scrollPast = Math.max(60 - rect.top, 0);
      const rawProgress = Math.min(scrollPast / transitionDistance, 1);
      const ease = Number(
        (rawProgress * rawProgress * (3 - 2 * rawProgress)).toFixed(4)
      );

      if (ease !== lastEase) {
        const r = Math.round(24 + (255 - 24) * ease);
        const g = Math.round(90 + (255 - 90) * ease);
        const b = Math.round(219 + (255 - 219) * ease);

        const canvas = document.getElementById("landing-canvas");
        if (canvas) {
          canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        if (glowRef.current) {
          glowRef.current.style.opacity = `${(1 - ease).toFixed(3)}`;
        }
        lastEase = ease;
      }

      // Perbarui status navbar & active scroll spy hanya jika berubah
      const scrollY = window.scrollY;
      const nextScrolled = scrollY > 20;
      if (nextScrolled !== lastScrolled) {
        setIsScrolled(nextScrolled);
        lastScrolled = nextScrolled;
      }

      const tentangEl = document.getElementById("tentang");
      const kontakEl = document.getElementById("kontak");
      const footerEl = document.getElementById("footer");
      const isRecentFooterClick =
        Date.now() - lastFooterNavClickRef.current <= 1500;

      let nextActive = "beranda";
      if (kontakEl && kontakEl.getBoundingClientRect().top <= 260) {
        if (!isRecentFooterClick) {
          const isFooterVisible =
            Boolean(footerEl && footerEl.getBoundingClientRect().top <= windowHeight * 0.55) ||
            window.innerHeight + scrollY >=
              document.documentElement.scrollHeight - 24;
          footerActiveModeRef.current = isFooterVisible ? "kontak" : "rekrutmen";
        }
        nextActive = footerActiveModeRef.current;
      } else {
        if (!isRecentFooterClick) {
          footerActiveModeRef.current = "rekrutmen";
        }
        if (tentangEl) {
          nextActive =
            tentangEl.getBoundingClientRect().top <= 250 ? "tentang" : "beranda";
        } else {
          nextActive = scrollY > 400 ? "tentang" : "beranda";
        }
      }

      if (nextActive !== lastActive) {
        setActiveSection(nextActive);
        lastActive = nextActive;
      }

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
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <section
      style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        backgroundColor: "transparent",
      }}
      className="relative w-full overflow-hidden text-white flex flex-col selection:bg-[#1655dc] selection:text-white pb-6 sm:pb-8"
    >
      {/* Background ambient lighting */}
      <div
        ref={glowRef}
        style={{ willChange: "opacity" }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 h-[580px] w-[580px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        <div className="absolute -top-32 -right-32 h-[580px] w-[580px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] rounded-full bg-[#3078ff]/25 blur-[150px]" />
      </div>

      {/* Floating navigation bar */}
      <PublicNavbar
        activePage="home"
        activeSection={activeSection}
        isScrolled={isScrolled}
        shadowed={false}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero headline & CTA buttons */}
      <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-6 pt-9 sm:pt-11 pb-0 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center rounded-full border-[1.5px] border-white/80 bg-transparent px-5 py-2 sm:px-6 sm:py-2.5 transition-colors cursor-default">
          <span className="text-[13px] sm:text-[14px] font-normal tracking-normal text-white">
            Komunitas Resmi di Bawah Naungan Fakultas Ilmu Komputer
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="mt-6 sm:mt-7 max-w-5xl xl:max-w-6xl text-[30px] sm:text-[48px] md:text-[58px] lg:text-[70px] xl:text-[74px] font-medium tracking-[-0.03em] text-white leading-[1.1]">
          <span className="block sm:whitespace-nowrap">Desain dan media kreatif yang</span>
          <span className="block sm:whitespace-nowrap">membangun citra fakultas.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-5 sm:mt-6 max-w-[540px] text-base sm:text-[17px] font-normal leading-[1.6] text-white/75">
          Studio kreatif independen Fasilkom, merancang karya visual dari <br className="hidden sm:inline" />
          konsep awal hingga publikasi.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <a
            href="#rekrutmen"
            onClick={(e) => {
              e.preventDefault();
              handleNavigateSection("rekrutmen");
            }}
            className="group flex w-full sm:w-auto items-center justify-between gap-3.5 rounded-full bg-white pl-6 pr-2 py-2 text-[15px] font-medium text-zinc-950 shadow-[0_12px_30px_rgba(6,25,80,0.18)] hover:bg-zinc-100 transition-colors duration-200 cursor-pointer select-none"
          >
            <span>Tertarik Bergabung?</span>
            <AnimatedArrowBadge variant="blue" shadowed />
          </a>

          <a
            href="#tentang"
            onClick={(e) => {
              e.preventDefault();
              handleNavigateSection("tentang");
            }}
            className="group flex w-full sm:w-auto items-center justify-between gap-3.5 rounded-full bg-[#255fdc]/55 hover:bg-[#255fdc]/75 backdrop-blur-md border border-white/20 pl-6 pr-2 py-2 text-[15px] font-medium text-white shadow-sm transition-colors duration-200 cursor-pointer select-none"
          >
            <span>Tentang Creatify</span>
            <AnimatedArrowBadge variant="white" shadowed />
          </a>
        </div>

        {/* Showcase video parallax */}
        <div
          ref={videoContainerRef}
          className="w-full px-1.5 sm:px-3 mt-14 sm:mt-20 mb-0 flex justify-center"
        >
          <div
            ref={videoFrameRef}
            style={{
              transform: "scale(0.7)",
              willChange: "transform",
              transformOrigin: "center top",
            }}
            className="group relative w-full max-w-[96vw] sm:max-w-[97vw] aspect-video overflow-hidden rounded-[36px] sm:rounded-[48px] md:rounded-[54px] bg-zinc-950/90 [transform:translateZ(0)] isolate"
          >
            {/* Autoplaying Showcase Video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80"
              className="h-full w-full object-cover"
            >
              <source src="/videos/showcase.mp4" type="video/mp4" />
            </video>

            {/* Subtle Glass Tint Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Kontrol play/pause showcase video */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={togglePlayPause}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:pointer-events-auto pointer-events-none group-hover:pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/95 hover:bg-white text-zinc-950 px-5 py-2.5 text-sm font-medium shadow-[0_12px_36px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
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
