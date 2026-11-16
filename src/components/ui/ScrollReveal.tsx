"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "down" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

type RevealCallback = () => void;

interface SharedObserverEntry {
  observer: IntersectionObserver;
  callbacks: Map<Element, RevealCallback>;
}

const DEFAULT_ROOT_MARGIN = "0px 0px -15px 0px";
const DEFAULT_THRESHOLD = 0.02;
let sharedObserver: SharedObserverEntry | null = null;

function revealElement(el: HTMLElement) {
  el.dataset.visible = "true";
}

function getSharedObserver(): SharedObserverEntry {
  if (sharedObserver) return sharedObserver;

  const callbacks = new Map<Element, RevealCallback>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
          continue;
        }
        const callback = callbacks.get(entry.target);
        if (callback) {
          callback();
          callbacks.delete(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: [0, DEFAULT_THRESHOLD],
      rootMargin: DEFAULT_ROOT_MARGIN,
    }
  );

  sharedObserver = { observer, callbacks };
  return sharedObserver;
}

function observeRevealTarget(el: HTMLElement, onReveal: RevealCallback): () => void {
  if (
    typeof IntersectionObserver === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    onReveal();
    return () => undefined;
  }

  // Reveal immediately ONLY if already scrolled past on initial load (e.g. hash links where element is above viewport)
  if (typeof window !== "undefined" && window.scrollY > 80) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0) {
      onReveal();
      return () => undefined;
    }
  }

  const entry = getSharedObserver();
  entry.callbacks.set(el, onReveal);
  entry.observer.observe(el);

  return () => {
    entry.callbacks.delete(el);
    entry.observer.unobserve(el);
    if (entry.callbacks.size === 0) {
      entry.observer.disconnect();
      if (sharedObserver === entry) {
        sharedObserver = null;
      }
    }
  };
}

function getVariantVars(
  variant: RevealVariant,
  distance: number,
  delay: number,
  duration: number
): CSSProperties {
  const vars: Record<string, string> = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-duration": `${duration}ms`,
    "--reveal-opacity-duration": `${Math.round(duration * 0.86)}ms`,
    "--reveal-y": "0px",
    "--reveal-scale": "1",
  };

  if (variant === "up") {
    vars["--reveal-y"] = `${distance}px`;
  } else if (variant === "down") {
    vars["--reveal-y"] = `${-distance}px`;
  } else if (variant === "scale") {
    vars["--reveal-y"] = `${Math.round(distance * 0.65)}px`;
    vars["--reveal-scale"] = "0.965";
  }

  return vars as CSSProperties;
}

/**
 * Lightweight GPU-accelerated scroll-reveal wrapper using a singleton IntersectionObserver.
 * Toggles `data-visible` directly on the DOM node so scrolling triggers zero React re-renders.
 */
export function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  duration = 900,
  distance = 28,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || node.dataset.visible === "true") return;

    return observeRevealTarget(node, () => revealElement(node));
  }, []);

  return (
    <div
      ref={ref}
      data-visible="false"
      style={getVariantVars(variant, distance, delay, duration)}
      className={cn("scroll-reveal", className)}
    >
      {children}
    </div>
  );
}

