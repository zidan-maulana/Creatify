"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type CSSProperties } from "react";
import { Play, Pause, Maximize2, X } from "lucide-react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { PublicNavbar, LandingSectionId } from "@/components/public/PublicNavbar";
import { useDismissableLayers } from "@/hooks/useDismissableLayer";
import { sanitizeVideoUrl } from "@/lib/video";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
} from "@/config/landing-cms";
import type { HeroContent, SiteSettingsContent } from "@/types/cms";

interface HeroSectionProps {
  content?: HeroContent;
  siteSettings?: SiteSettingsContent;
}

export function HeroSection({
  content = DEFAULT_LANDING_CONTENT.hero,
  siteSettings = DEFAULT_SITE_SETTINGS,
}: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileVideoOverlayOpen, setIsMobileVideoOverlayOpen] =
    useState<boolean>(false);
  const [isFullLandscapeOpen, setIsFullLandscapeOpen] = useState<boolean>(false);
  const footerActiveModeRef = useRef<"rekrutmen" | "kontak">("rekrutmen");
  const lastFooterNavClickRef = useRef<number>(0);
  const wasPlayingBeforeModalRef = useRef<boolean>(true);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);

  const sanitizedVideo = useMemo(
    () => sanitizeVideoUrl(content.videoUrl),
    [content.videoUrl]
  );

  useDismissableLayers([
    {
      ref: videoFrameRef,
      enabled: isMobileVideoOverlayOpen,
      onDismiss: () => setIsMobileVideoOverlayOpen(false),
    },
  ]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      void videoRef.current.play().catch(() => undefined);
      setIsPlaying(true);
    }
  };

  const openFullLandscapeModal = () => {
    wasPlayingBeforeModalRef.current = isPlaying;
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setIsFullLandscapeOpen(true);
  };

  const closeFullLandscapeModal = useCallback(() => {
    setIsFullLandscapeOpen(false);
    if (videoRef.current && wasPlayingBeforeModalRef.current) {
      void videoRef.current.play().catch(() => undefined);
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (!isFullLandscapeOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFullLandscapeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullLandscapeOpen, closeFullLandscapeModal]);

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
    let lastScrolled: boolean | null = null;
    let lastActive = "";
    let scrollRafId: number | null = null;

    const updateParallax = () => {
      if (!videoContainerRef.current || !videoFrameRef.current) {
        ticking = false;
        return;
      }

      const rect = videoContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isMobileViewport = window.innerWidth < 768;
      const minScale = isMobileViewport ? 0.93 : 0.7;

      // Skala frame video berdasarkan posisi scroll (0.93-1.0 pada mobile, 0.70-1.0 pada desktop)
      const start = windowHeight;
      const end = 60;
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      const scale = Number((minScale + progress * (1 - minScale)).toFixed(4));

      if (scale !== lastScale) {
        videoFrameRef.current.style.setProperty(
          "--hero-video-scale",
          String(scale)
        );
        lastScale = scale;
      }

      // Perbarui status navbar & active scroll spy hanya jika berubah
      const scrollY = window.scrollY;
      const nextScrolled = scrollY > 20;
      if (nextScrolled !== lastScrolled) {
        setIsScrolled(nextScrolled);
        lastScrolled = nextScrolled;
      }

      if (glowRef.current) {
        const glowOpacity = Math.max(0, 1 - scrollY / (windowHeight * 0.75));
        glowRef.current.style.opacity = glowOpacity.toFixed(2);
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
        scrollRafId = window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRafId !== null) window.cancelAnimationFrame(scrollRafId);
    };
  }, []);

  return (
    <section
      style={{
        fontFamily: "var(--font-bricolage), sans-serif",
        backgroundColor: "transparent",
      }}
      className="relative w-full overflow-hidden text-white flex flex-col selection:bg-[#1655dc] selection:text-white pb-6 sm:pb-8"
    >
      {/* Background ambient lighting & seamless blue-to-white stage transition */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #185adb 0%, #185adb 70%, #185adb 82%, rgba(24, 90, 219, 0.45) 94%, #ffffff 100%)",
        }}
      >
        <div
          ref={glowRef}
          style={{ willChange: "opacity" }}
          className="absolute inset-0"
        >
          <div className="absolute -top-24 -left-24 sm:-top-32 sm:-left-32 h-[320px] w-[320px] sm:h-[580px] sm:w-[580px] rounded-full bg-[#5293ff]/30 blur-[100px] sm:blur-[130px]" />
          <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 h-[320px] w-[320px] sm:h-[580px] sm:w-[580px] rounded-full bg-[#5293ff]/30 blur-[100px] sm:blur-[130px]" />
          <div className="absolute top-[28%] sm:top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[420px] sm:h-[650px] sm:w-[850px] rounded-full bg-[#3078ff]/25 blur-[110px] sm:blur-[150px]" />
        </div>
      </div>

      {/* Floating navigation bar */}
      <PublicNavbar
        activePage="home"
        activeSection={activeSection}
        isScrolled={isScrolled}
        shadowed={false}
        animateOnMount
        brandName={siteSettings.name}
        ctaLabel={siteSettings.navbarCtaLabel}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero headline & CTA buttons */}
      <div className="hidden md:block h-20 w-full shrink-0" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-3.5 sm:px-6 pt-0 md:pt-11 pb-0 text-center">
        {/* Blok utama hero pada mobile */}
        <div className="w-full flex flex-col items-center justify-start pt-[104px] min-[390px]:pt-[110px] pb-4 md:pt-0 md:pb-0">
          {/* Status Badge */}
          <div
            style={
              {
                "--hero-delay": "100ms",
                "--hero-duration": "0.96s",
                "--hero-y": "16px",
              } as CSSProperties
            }
            className="hero-enter inline-flex max-w-full items-center justify-center rounded-full border-[1.5px] border-white/80 bg-transparent px-3.5 py-2 min-[390px]:px-4 min-[390px]:py-2.5 md:px-6 md:py-2.5 transition-colors cursor-default"
          >
            <span className="text-[9.5px] min-[390px]:text-[10.5px] md:text-[14px] font-normal tracking-tight md:tracking-normal text-white leading-tight whitespace-nowrap truncate max-w-full">
              {content.badgeText}
            </span>
          </div>

          {/* Primary Headline */}
          <h1
            style={
              {
                "--hero-delay": "230ms",
                "--hero-duration": "0.88s",
                "--hero-y": "20px",
                "--hero-blur": "18px",
              } as CSSProperties
            }
            className="hero-enter-blur mt-5 md:mt-7 max-w-[360px] sm:max-w-xl md:max-w-5xl xl:max-w-6xl text-[35px] min-[390px]:text-[41px] sm:text-[48px] md:text-[58px] lg:text-[70px] xl:text-[74px] font-medium tracking-[-0.035em] md:tracking-[-0.03em] text-white leading-[1.06] md:leading-[1.1]"
          >
            <span className="inline md:block md:whitespace-nowrap">
              {content.headlineLine1}{" "}
            </span>
            <span className="inline md:block md:whitespace-nowrap">
              {content.headlineLine2}
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            style={
              {
                "--hero-delay": "340ms",
                "--hero-duration": "0.80s",
                "--hero-y": "16px",
                "--hero-blur": "14px",
              } as CSSProperties
            }
            className="hero-enter-blur mt-4 md:mt-6 max-w-[332px] min-[390px]:max-w-[362px] sm:max-w-[480px] md:max-w-[540px] text-[12px] min-[390px]:text-[13px] md:text-[17px] font-normal leading-[1.5] md:leading-[1.6] text-white/80 md:text-white/75 md:whitespace-pre-line"
          >
            {content.subheadline}
          </p>

          {/* Action Buttons */}
          <div
            style={
              {
                "--hero-delay": "430ms",
                "--hero-duration": "0.72s",
                "--hero-y": "14px",
                "--hero-blur": "10px",
              } as CSSProperties
            }
            className="hero-enter-blur mt-7 md:mt-10 flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-2 min-[410px]:gap-2.5 md:gap-3.5 w-full max-w-[368px] md:max-w-none md:w-auto"
          >
            <a
              href="#rekrutmen"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateSection("rekrutmen");
              }}
              className="group inline-flex flex-auto md:flex-initial items-center justify-between gap-1.5 min-[410px]:gap-2 md:gap-3.5 rounded-full bg-white pl-4.5 pr-1.5 py-2 text-[11.5px] min-[390px]:pl-5.5 min-[390px]:pr-1.5 min-[390px]:py-2.5 min-[390px]:text-[12px] md:pl-6 md:pr-2 md:py-2 md:text-[15px] font-medium text-zinc-950 hover:bg-zinc-100 transition-colors duration-200 cursor-pointer select-none whitespace-nowrap"
            >
              <span>{content.primaryCtaLabel}</span>
              <AnimatedArrowBadge
                variant="blue"
                className="h-[30px] w-[30px] min-[410px]:h-8 min-[410px]:w-8"
              />
            </a>

            <a
              href="#tentang"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateSection("tentang");
              }}
              className="group inline-flex flex-auto md:flex-initial items-center justify-between gap-1.5 min-[410px]:gap-2 md:gap-3.5 rounded-full bg-[#255fdc]/55 hover:bg-[#255fdc]/75 backdrop-blur-md border border-white/25 md:border-white/20 pl-4.5 pr-1.5 py-2 text-[11.5px] min-[390px]:pl-5.5 min-[390px]:pr-1.5 min-[390px]:py-2.5 min-[390px]:text-[12px] md:pl-6 md:pr-2 md:py-2 md:text-[15px] font-medium text-white transition-colors duration-200 cursor-pointer select-none whitespace-nowrap"
            >
              <span>{content.secondaryCtaLabel}</span>
              <AnimatedArrowBadge
                variant="white"
                className="h-[30px] w-[30px] min-[410px]:h-8 min-[410px]:w-8"
              />
            </a>
          </div>
        </div>

        {/* Showcase video (portrait di mobile, 16:9 di desktop) */}
        <div
          ref={videoContainerRef}
          style={
            {
              "--hero-delay": "500ms",
              "--hero-duration": "0.64s",
              "--hero-y": "22px",
              "--hero-blur": "10px",
              "--hero-scale": "0.985",
            } as CSSProperties
          }
          className="hero-enter-blur w-full px-0 sm:px-3 mt-6 md:mt-20 mb-0 flex justify-center"
        >
          <div
            ref={videoFrameRef}
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileVideoOverlayOpen((prev) => !prev);
              }
            }}
            style={{
              transform:
                "scale3d(var(--hero-video-scale), var(--hero-video-scale), 1)",
              willChange: "transform",
              transformOrigin: "center top",
            }}
            className="group relative [--hero-video-scale:0.93] md:[--hero-video-scale:0.7] w-full max-w-[360px] sm:max-w-[440px] md:max-w-[97vw] aspect-[9/14] sm:aspect-[3/4] md:aspect-video overflow-hidden rounded-[26px] sm:rounded-[36px] md:rounded-[54px] bg-zinc-950/90 [transform:translateZ(0)] isolate cursor-pointer md:cursor-default"
          >
            {/* Autoplaying Showcase Video: Hybrid Support (YouTube / Vimeo / MP4) */}
            {sanitizedVideo ? (
              <iframe
                src={`${sanitizedVideo.embedUrl}?autoplay=1&mute=1&loop=1&playlist=${sanitizedVideo.videoId}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&fs=0`}
                title="Showcase Video Creatify"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="h-full w-full object-cover pointer-events-none scale-[1.32] -translate-y-[5%]"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              >
                <source src={content.videoUrl} type="video/mp4" />
              </video>
            )}

            {/* Subtle Glass Tint Gradient Overlay (khusus desktop) */}
            <div className="hidden md:block pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Kontrol play/pause desktop (hover overlay, hanya untuk native video) */}
            {!sanitizedVideo && (
              <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
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
            )}

            {/* Tombol Lihat Penuh di tengah card saat di-hover atau ditekan (khusus mobile) */}
            <div
              className={`md:hidden absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                isMobileVideoOverlayOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto"
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileVideoOverlayOpen(false);
                  openFullLandscapeModal();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white/95 hover:bg-white text-zinc-950 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-transform duration-200 active:scale-95 cursor-pointer"
              >
                <Maximize2 className="h-4 w-4 stroke-[2.1]" />
                <span>Lihat Penuh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal video penuh ukuran landscape (16:9) */}
      {isFullLandscapeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Video Penuh Landscape"
          onClick={closeFullLandscapeModal}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-fade-in-simple"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-3 px-1">
              <span className="text-[13px] font-medium text-white/80">
                Tampilan Landscape (16:9)
              </span>
              <button
                type="button"
                onClick={closeFullLandscapeModal}
                aria-label="Tutup tampilan video penuh"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Tutup</span>
              </button>
            </div>

            <div className="relative w-full aspect-video overflow-hidden rounded-[18px] bg-black border border-white/15 shadow-2xl">
              {sanitizedVideo ? (
                <iframe
                  src={`${sanitizedVideo.embedUrl}?autoplay=1&controls=1&rel=0`}
                  title="Full Video Showcase"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full object-contain"
                />
              ) : (
                <video
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                >
                  <source src={content.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
