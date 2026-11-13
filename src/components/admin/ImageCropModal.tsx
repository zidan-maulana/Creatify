"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  Move,
  Loader2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  aspectRatioLabel?: string;
  aspectRatioValue?: number; // width / height, misal 3/4 = 0.75, 16/9 = 1.777
  onApply: (croppedBlob: Blob, previewUrl: string) => Promise<void> | void;
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  aspectRatioLabel = "Format Standar",
  aspectRatioValue = 16 / 9,
  onApply,
}: ImageCropModalProps) {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  // State Transformasi (Zoom, Pan, Rotate)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });

  // Loading submit state
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state saat modal dibuka dengan gambar baru
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setImageLoaded(false);
      setErrorMsg("");
      setIsApplying(false);
    }
  }, [isOpen, imageSrc]);

  // Lock body scroll saat modal aktif
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Hitung ukuran box crop berdasarkan aspect ratio
  const getCropBoxDimensions = useCallback(() => {
    // Ukuran maksimal area crop di dalam modal viewport
    const maxWidth = typeof window !== "undefined" ? Math.min(window.innerWidth - 64, 460) : 400;
    const maxHeight = typeof window !== "undefined" ? Math.min(window.innerHeight - 340, 420) : 320;

    const ratio = aspectRatioValue > 0 ? aspectRatioValue : 16 / 9;

    let width = maxWidth;
    let height = width / ratio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }

    return { width, height };
  }, [aspectRatioValue]);

  // Hitung batas pan agar gambar tidak keluar dari frame crop (TikTok style clamping)
  const clampPan = useCallback(
    (newX: number, newY: number, currentZoom: number, currentRot: number) => {
      if (!naturalSize.width || !naturalSize.height) return { x: newX, y: newY };

      const { width: boxW, height: boxH } = getCropBoxDimensions();
      const isRotatedQuarter = currentRot % 180 !== 0;
      const effectiveW = isRotatedQuarter ? naturalSize.height : naturalSize.width;
      const effectiveH = isRotatedQuarter ? naturalSize.width : naturalSize.height;

      const baseScale = Math.max(boxW / effectiveW, boxH / effectiveH);
      const displayedW = effectiveW * baseScale * currentZoom;
      const displayedH = effectiveH * baseScale * currentZoom;

      const maxPanX = Math.max(0, (displayedW - boxW) / 2);
      const maxPanY = Math.max(0, (displayedH - boxH) / 2);

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      };
    },
    [naturalSize, getCropBoxDimensions]
  );

  // Mouse / Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const targetX = dragStartRef.current.initialPanX + deltaX;
    const targetY = dragStartRef.current.initialPanY + deltaY;

    const clamped = clampPan(targetX, targetY, zoom, rotation);
    setPan(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Abaikan jika pointer capture gagal dilepas
      }
    }
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newZoom = Math.max(1, Math.min(3, Number((zoom + delta).toFixed(2))));
    setZoom(newZoom);
    setPan((prev) => clampPan(prev.x, prev.y, newZoom, rotation));
  };

  // Tombol zoom in / out
  const changeZoom = (delta: number) => {
    const newZoom = Math.max(1, Math.min(3, Number((zoom + delta).toFixed(2))));
    setZoom(newZoom);
    setPan((prev) => clampPan(prev.x, prev.y, newZoom, rotation));
  };

  // Tombol putar 90 derajat
  const handleRotate = () => {
    const newRot = (rotation + 90) % 360;
    setRotation(newRot);
    setPan((prev) => clampPan(prev.x, prev.y, zoom, newRot));
  };

  // Reset transformasi
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // Render crop ke Canvas beresolusi tinggi & export Blob
  const handleApplyCrop = async () => {
    if (!imageRef.current || !naturalSize.width || !naturalSize.height) return;

    setIsApplying(true);
    setErrorMsg("");

    try {
      const { width: boxW, height: boxH } = getCropBoxDimensions();
      const isRotatedQuarter = rotation % 180 !== 0;
      const effectiveW = isRotatedQuarter ? naturalSize.height : naturalSize.width;
      const effectiveH = isRotatedQuarter ? naturalSize.width : naturalSize.height;

      // Hitung resolusi output berkualitas tinggi (maks 1400px agar tajam & optimal untuk web)
      const maxExportDim = 1400;
      const ratio = aspectRatioValue > 0 ? aspectRatioValue : boxW / boxH;
      let targetW = ratio >= 1 ? maxExportDim : Math.round(maxExportDim * ratio);
      let targetH = Math.round(targetW / ratio);

      if (targetH > maxExportDim) {
        targetH = maxExportDim;
        targetW = Math.round(targetH * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Gagal membuat konteks canvas grafis.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Translasi ke titik tengah kanvas
      ctx.translate(targetW / 2, targetH / 2);

      // Skala konversi dari ukuran kotak preview ke kanvas hasil akhir
      const k = targetW / boxW;

      // Geser sesuai pan pengguna
      ctx.translate(pan.x * k, pan.y * k);

      // Putar sesuai orientasi
      ctx.rotate((rotation * Math.PI) / 180);

      // Hitung ukuran gambar yang digambar
      const baseScale = Math.max(boxW / effectiveW, boxH / effectiveH);
      const drawScale = baseScale * zoom * k;
      const drawW = naturalSize.width * drawScale;
      const drawH = naturalSize.height * drawScale;

      ctx.drawImage(imageRef.current, -drawW / 2, -drawH / 2, drawW, drawH);

      // Export ke Blob (WebP atau JPEG)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          "image/webp",
          0.92
        );
      });

      if (!blob) {
        throw new Error("Gagal mengekspor hasil crop gambar.");
      }

      const previewUrl = URL.createObjectURL(blob);
      await onApply(blob, previewUrl);
      onClose();
    } catch (err) {
      console.error("Gagal melakukan crop gambar:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal memproses crop gambar. Pastikan gambar tidak dilindungi pembatasan CORS."
      );
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const { width: cropBoxW, height: cropBoxH } = getCropBoxDimensions();

  // Hitung scaling CSS untuk render gambar di dalam kotak crop
  const isRotatedQuarter = rotation % 180 !== 0;
  const effectiveW = isRotatedQuarter ? naturalSize.height : naturalSize.width;
  const effectiveH = isRotatedQuarter ? naturalSize.width : naturalSize.height;
  const baseScale =
    effectiveW && effectiveH
      ? Math.max(cropBoxW / effectiveW, cropBoxH / effectiveH)
      : 1;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0f1d]/75 backdrop-blur-[6px] p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-[24px] sm:rounded-[28px] border border-zinc-200/20 bg-[#121526] text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
      >
        {/* Header Modal */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-4.5 border-b border-white/10 bg-[#0f1221]">
          <div>
            <h3
              id="crop-modal-title"
              className="text-[17.5px] sm:text-[19px] font-semibold text-white tracking-[-0.01em]"
            >
              Sesuaikan Posisi &amp; Crop
            </h3>
            <p className="text-[12px] text-zinc-400 mt-0.5">
              Geser dan perbesar foto untuk menyesuaikan proporsi ({aspectRatioLabel}).
            </p>
          </div>
          <button
            type="button"
            disabled={isApplying}
            onClick={onClose}
            aria-label="Tutup modal crop"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Viewport Area Interaktif (TikTok Style) */}
        <div
          ref={viewportRef}
          onWheel={handleWheel}
          className="relative flex-1 min-h-[300px] sm:min-h-[360px] flex items-center justify-center bg-black/60 overflow-hidden select-none touch-none"
        >
          {/* Badge Petunjuk Geser */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90 shadow-sm">
            <Move className="h-3 w-3 text-[#185adb]" />
            <span>Klik &amp; geser untuk mengubah posisi</span>
          </div>

          {/* Kotak Frame Crop Aktif */}
          <div
            style={{ width: `${cropBoxW}px`, height: `${cropBoxH}px` }}
            className={cn(
              "relative overflow-hidden rounded-[14px] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(12,15,29,0.75)] cursor-grab active:cursor-grabbing transition-[shadow] duration-200",
              isDragging && "border-[#185adb]"
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Grid 3x3 Rule-of-Thirds (TikTok/Instagram style) */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 transition-opacity duration-200",
                isDragging ? "opacity-70" : "opacity-30"
              )}
            >
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-white/40" />
              <div className="border-r border-white/40" />
              <div />
            </div>

            {/* Gambar yang di-transform */}
            {/* Menggunakan elemen img murni dengan crossorigin anonymous */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Pratinjau Crop"
              crossOrigin="anonymous"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                setNaturalSize({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
                setImageLoaded(true);
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${
                  baseScale * zoom
                }) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                maxWidth: "none",
                maxHeight: "none",
                willChange: "transform",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          </div>
        </div>

        {/* Toolbar Kontrol Zoom, Putar, & Reset */}
        <div className="shrink-0 px-6 py-4 bg-[#0f1221] border-t border-white/10 space-y-3">
          {/* Zoom Slider Bar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={zoom <= 1 || isApplying}
              onClick={() => changeZoom(-0.15)}
              aria-label="Perkecil zoom"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                disabled={isApplying}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setZoom(val);
                  setPan((prev) => clampPan(prev.x, prev.y, val, rotation));
                }}
                aria-label="Atur perbesaran gambar"
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#185adb] focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={zoom >= 3 || isApplying}
              onClick={() => changeZoom(0.15)}
              aria-label="Perbesar zoom"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <span className="w-11 text-right text-[12px] font-mono text-zinc-400 select-none">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Tombol Alat Bantu (Rotate & Reset) */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isApplying}
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[12px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5 text-[#185adb]" />
                <span>Putar 90°</span>
              </button>

              <button
                type="button"
                disabled={isApplying || (zoom === 1 && pan.x === 0 && pan.y === 0 && rotation === 0)}
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[12px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <span className="text-[11.5px] text-zinc-400">
              Rasio: <strong className="text-white font-medium">{aspectRatioLabel}</strong>
            </span>
          </div>

          {errorMsg && (
            <p className="text-[12px] text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Footer Modal Actions */}
        <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 bg-[#0a0c16] border-t border-white/10">
          <button
            type="button"
            disabled={isApplying}
            onClick={onClose}
            className="px-4 py-2 rounded-[12px] text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={isApplying || !imageLoaded}
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-[12px] bg-[#185adb] hover:bg-[#1449b2] text-[13px] font-medium text-white shadow-lg shadow-[#185adb]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses &amp; Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Terapkan &amp; Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
