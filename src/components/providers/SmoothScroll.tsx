"use client";

import React, { useEffect, useRef } from "react";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const isScrollingRef = useRef(false);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Lewati perangkat layar sentuh (mobile/tablet sudah memiliki inersia bawaan yang sangat mulus)
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) return;

    // 2. Hormati preferensi pengguna yang mematikan animasi
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;

    const clamp = (val: number, min: number, max: number) =>
      Math.max(min, Math.min(val, max));

    const getMaxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const canElementScroll = (el: HTMLElement, deltaY: number) => {
      if (deltaY === 0) return false;
      const { overflowY } = window.getComputedStyle(el);
      const isScrollableY =
        overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
      if (!isScrollableY || el.scrollHeight <= el.clientHeight + 1) return false;

      return deltaY < 0
        ? el.scrollTop > 0
        : el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    };

    const hasScrollableAncestor = (
      target: EventTarget | null,
      deltaY: number
    ) => {
      let el: Element | null = target instanceof Element ? target : null;
      while (el && el !== document.documentElement) {
        if (el instanceof HTMLElement && canElementScroll(el, deltaY)) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    // 3. Tangkap wheel mouse dan hitung jarak perpindahan dengan momentum
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // Izinkan zoom browser dengan Ctrl + Scroll

      const modalOpen = Boolean(document.querySelector('[aria-modal="true"]'));
      const scrollableAncestor = hasScrollableAncestor(e.target, e.deltaY);

      if (modalOpen || scrollableAncestor) {
        // Saat modal terbuka tetapi target sudah di ujung scroll / di backdrop,
        // tahan agar halaman di belakang modal tidak ikut bergeser.
        if (modalOpen && !scrollableAncestor) {
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();

      const maxScroll = getMaxScroll();
      // Faktor pengali delta untuk kenyamanan scrolling
      const delta = e.deltaY * 1.15;
      targetYRef.current = clamp(targetYRef.current + delta, 0, maxScroll);

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        startRaf();
      }
    };

    // 4. Loop LERP (Linear Interpolation) 60-120fps untuk pergerakan halus seperti meluncur
    const updateScroll = () => {
      const diff = targetYRef.current - currentYRef.current;

      // Damping factor: 0.09 untuk responsivitas yang luwes dan bebas lag
      currentYRef.current += diff * 0.09;

      if (Math.abs(diff) < 0.3) {
        currentYRef.current = targetYRef.current;
        window.scrollTo(0, currentYRef.current);
        isScrollingRef.current = false;
        rafIdRef.current = null;
        return;
      }

      // Hindari Math.round() agar pergerakan sub-pixel mengalir halus tanpa patah-patah
      window.scrollTo(0, currentYRef.current);
      rafIdRef.current = requestAnimationFrame(updateScroll);
    };

    const startRaf = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateScroll);
      }
    };

    // 5. Sinkronisasi jika pengguna mengklik scrollbar atau menekan tombol navigasi
    const onNativeScroll = () => {
      if (!isScrollingRef.current) {
        currentYRef.current = window.scrollY;
        targetYRef.current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return <>{children}</>;
}

