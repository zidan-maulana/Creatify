"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface DismissableLayerEntry {
  ref: RefObject<HTMLElement | null>;
  enabled: boolean;
  onDismiss: () => void;
}

/**
 * Registers global outside-pointer and Escape key listeners only while at least
 * one dismissable layer (dropdown, popover, or modal) is open.
 */
export function useDismissableLayers(layers: readonly DismissableLayerEntry[]) {
  const layersRef = useRef(layers);
  const hasActiveLayer = layers.some((layer) => layer.enabled);

  useEffect(() => {
    layersRef.current = layers;
  });

  useEffect(() => {
    if (!hasActiveLayer) return;

    const handleOutsidePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      for (const layer of layersRef.current) {
        if (
          layer.enabled &&
          layer.ref.current &&
          !layer.ref.current.contains(target)
        ) {
          layer.onDismiss();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      for (const layer of layersRef.current) {
        if (layer.enabled) {
          layer.onDismiss();
        }
      }
    };

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("touchstart", handleOutsidePointer, {
      passive: true,
    });
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("touchstart", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [hasActiveLayer]);
}

