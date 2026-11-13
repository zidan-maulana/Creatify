"use client";

import React, { useRef, useState, useMemo } from "react";
import { Upload, ImagePlus, RotateCcw, Crop } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadMediaAction } from "@/actions/media-actions";
import { ImageCropModal } from "@/components/admin/ImageCropModal";

const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

interface AdminImageUploadProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  aspectClass?: string;
  fillHeight?: boolean;
  compactActions?: boolean;
  helperText?: string;
  error?: string;
  maxSizeMb?: number;
  required?: boolean;
}

function parseAspectDetails(aspectClass?: string): { value: number; label: string } {
  if (!aspectClass) {
    return { value: 16 / 9, label: "16:9 Landscape" };
  }
  if (aspectClass.includes("aspect-square") || aspectClass.includes("aspect-[1/1]")) {
    return { value: 1, label: "1:1 Persegi" };
  }
  if (aspectClass.includes("aspect-[3/4]")) {
    return { value: 3 / 4, label: "3:4 Potret Tim" };
  }
  if (aspectClass.includes("aspect-[4/3]")) {
    return { value: 4 / 3, label: "4:3 Foto Standard" };
  }
  if (aspectClass.includes("aspect-[16/9]")) {
    return { value: 16 / 9, label: "16:9 Showcase / Banner" };
  }

  const match = aspectClass.match(/aspect-\[(\d+)\/(\d+)\]/);
  if (match) {
    const w = parseFloat(match[1]);
    const h = parseFloat(match[2]);
    if (w > 0 && h > 0) {
      return { value: w / h, label: `${w}:${h}` };
    }
  }

  return { value: 16 / 9, label: "Format Standar" };
}

export function AdminImageUpload({
  id,
  label,
  value,
  onChange,
  defaultValue,
  aspectClass = "aspect-[16/9]",
  fillHeight = false,
  compactActions = false,
  helperText = "Format JPG, PNG, WEBP · Maksimal 5 MB",
  error,
  maxSizeMb = 5,
  required,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState("");

  // Crop Modal state
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const activeBlobUrlRef = useRef<string | null>(null);

  const activeError = localError || error;
  const canRestoreDefault = Boolean(defaultValue && value !== defaultValue);

  const aspectDetails = useMemo(() => parseAspectDetails(aspectClass), [aspectClass]);

  // Bersihkan URL sementara saat selesai
  const cleanupBlobUrl = () => {
    if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setLocalError("");

    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      setLocalError("Format tidak didukung. Gunakan file JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`Ukuran gambar melebihi batas maksimal ${maxSizeMb} MB.`);
      return;
    }

    // Buat URL lokal untuk pratinjau dan buka modal crop interaktif
    cleanupBlobUrl();
    const objectUrl = URL.createObjectURL(file);
    activeBlobUrlRef.current = objectUrl;
    setCropSrc(objectUrl);
    setIsCropOpen(true);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Callback saat user selesai menyesuaikan foto di modal crop
  const handleApplyCroppedImage = async (blob: Blob) => {
    setIsProcessing(true);
    setLocalError("");

    try {
      const croppedFile = new File([blob], `cropped-${Date.now()}.webp`, {
        type: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", croppedFile);

      const res = await uploadMediaAction(formData);
      if (!res.success) {
        setLocalError(res.error.message || "Gagal mengunggah gambar hasil crop.");
        return;
      }

      onChange(res.data.url);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Gagal memproses gambar."
      );
    } finally {
      setIsProcessing(false);
      cleanupBlobUrl();
    }
  };

  // Tombol aksi ganti & sesuaikan
  const actionButtons = (
    <div className={cn("flex items-center gap-1.5", compactActions ? "w-full flex-col" : "flex-wrap")}>
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[12px] border border-zinc-200/90 bg-white hover:bg-zinc-50 py-1.5 text-[12px] font-medium text-[#0c0f1d] transition-colors cursor-pointer disabled:opacity-60",
          compactActions ? "w-full justify-center px-3" : "px-3"
        )}
      >
        <Upload className="h-3.5 w-3.5 text-[#185adb]" />
        <span>{isProcessing ? "Memproses..." : "Ganti Gambar"}</span>
      </button>

      {value && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => {
            setCropSrc(value);
            setIsCropOpen(true);
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[12px] border border-zinc-200/90 bg-white hover:bg-zinc-50 py-1.5 text-[12px] font-medium text-[#0c0f1d] transition-colors cursor-pointer disabled:opacity-60",
            compactActions ? "w-full justify-center px-3" : "px-3"
          )}
        >
          <Crop className="h-3.5 w-3.5 text-[#185adb]" />
          <span>Sesuaikan Posisi</span>
        </button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        fillHeight && "lg:h-full lg:flex lg:flex-col",
        compactActions && "sm:h-full sm:flex sm:flex-col"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label
          htmlFor={id}
          className="block text-[12.5px] font-medium text-[#0c0f1d]"
        >
          {label}
          {required && <span className="text-[#185adb] ml-0.5">*</span>}
        </label>

        {canRestoreDefault && defaultValue && (
          <button
            type="button"
            onClick={() => {
              setLocalError("");
              onChange(defaultValue);
            }}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zinc-500 hover:text-[#185adb] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Bawaan</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-[18px] sm:rounded-[20px] border transition-colors",
          compactActions ? "p-2.5 sm:flex-1 sm:flex sm:flex-col" : "p-3",
          fillHeight && "lg:flex-1 lg:flex lg:flex-col",
          activeError
            ? "border-red-400 bg-red-50/35"
            : isDragging
            ? "border-[#185adb] bg-[#185adb]/[0.04]"
            : "border-zinc-200/80 bg-[#f4f5f7]"
        )}
      >
        {value ? (
          <div
            className={cn(
              "space-y-3",
              fillHeight && "lg:flex-1 lg:flex lg:flex-col lg:space-y-0 lg:gap-3",
              compactActions &&
                "space-y-2 sm:flex-1 sm:flex sm:flex-col sm:space-y-0 sm:gap-2"
            )}
          >
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-[12px] sm:rounded-[14px] bg-zinc-200/70",
                aspectClass,
                fillHeight && "lg:aspect-auto lg:flex-1 lg:min-h-[180px]",
                compactActions && "sm:aspect-auto sm:flex-1 sm:min-h-[160px]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className={cn(
                  "h-full w-full object-cover",
                  compactActions && "object-top sm:absolute sm:inset-0",
                  fillHeight && "lg:absolute lg:inset-0"
                )}
              />
            </div>

            {compactActions ? (
              <div className="space-y-1.5 pt-0.5 shrink-0">
                {actionButtons}
                <span className="block text-center text-[10.5px] leading-tight text-zinc-500">
                  {helperText}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <span className="text-[11.5px] text-zinc-500">{helperText}</span>
                {actionButtons}
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "w-full py-8 px-4 flex flex-col items-center justify-center text-center rounded-[14px] border border-dashed border-zinc-300 bg-white/75 hover:bg-white transition-colors cursor-pointer disabled:opacity-60",
              fillHeight && "lg:flex-1",
              compactActions && "sm:flex-1"
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#185adb]/10 text-[#185adb]">
              <ImagePlus className="h-5 w-5" />
            </span>
            <span className="mt-3 text-[13.5px] font-medium text-[#0c0f1d]">
              {isProcessing
                ? "Memproses gambar..."
                : "Klik untuk memilih atau seret gambar ke sini"}
            </span>
            <span className="mt-1 text-[11.5px] text-zinc-500">
              {helperText}
            </span>
          </button>
        )}
      </div>

      {activeError && (
        <p className="mt-1.5 text-[12px] text-red-500">{activeError}</p>
      )}

      {/* Modal Crop & Sesuaikan Posisi (TikTok Style) */}
      <ImageCropModal
        isOpen={isCropOpen}
        onClose={() => {
          setIsCropOpen(false);
          cleanupBlobUrl();
        }}
        imageSrc={cropSrc}
        aspectRatioValue={aspectDetails.value}
        aspectRatioLabel={aspectDetails.label}
        onApply={handleApplyCroppedImage}
      />
    </div>
  );
}
