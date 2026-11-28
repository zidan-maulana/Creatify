"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Video,
  Link2,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeVideoUrl } from "@/lib/video";
import {
  createSignedVideoUploadAction,
  uploadVideoAction,
} from "@/actions/media-actions";

interface AdminVideoUploadProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  error?: string;
  helperText?: string;
}

export function AdminVideoUpload({
  id,
  label,
  value,
  onChange,
  defaultValue = "/videos/showcase.mp4",
  error,
  helperText = "Mendukung tautan YouTube/Vimeo atau berkas MP4/WebM lokal.",
}: AdminVideoUploadProps) {
  const sanitized = useMemo(() => sanitizeVideoUrl(value), [value]);
  const isExternalVideo = Boolean(sanitized);

  // Tab mode aktif: "youtube" jika link adalah YouTube/Vimeo, "upload" jika MP4/file
  const [activeTab, setActiveTab] = useState<"youtube" | "upload">(
    isExternalVideo ? "youtube" : "upload"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canRestoreDefault = Boolean(defaultValue && value !== defaultValue);

  const handleFileUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setUploadError("");
    if (!file.type.includes("mp4") && !file.type.includes("webm") && !file.type.includes("quicktime")) {
      setUploadError("Format tidak didukung. Harap unggah berkas video MP4 atau WebM.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("Ukuran berkas video melebihi batas maksimal 50 MB.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Minta Signed Upload URL (untuk upload langsung ke Supabase Storage agar bebas batas 4.5 MB Vercel)
      const signRes = await createSignedVideoUploadAction(
        file.name,
        file.type,
        file.size
      );

      if (!signRes.success) {
        setUploadError(signRes.error.message || "Gagal menyiapkan unggah video.");
        return;
      }

      if ("signedUrl" in signRes.data) {
        const directRes = await fetch(signRes.data.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": signRes.data.contentType || file.type || "video/mp4",
          },
          body: file,
        });

        if (!directRes.ok) {
          const errText = await directRes.text().catch(() => "");
          let errMsg = `Gagal mengunggah video ke cloud storage (HTTP ${directRes.status}).`;
          try {
            const parsed = JSON.parse(errText);
            if (parsed.message || parsed.error) {
              errMsg = parsed.message || parsed.error;
            }
          } catch {}
          setUploadError(errMsg);
          return;
        }

        onChange(signRes.data.publicUrl);
        setActiveTab("upload");
        return;
      }

      // 2. Fallback ke server upload (hanya jika Supabase Storage belum aktif, misal localhost)
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadVideoAction(formData);
      if (!res.success) {
        setUploadError(res.error.message || "Gagal mengunggah berkas video.");
        return;
      }

      onChange(res.data.url);
      setActiveTab("upload");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kendala saat mengunggah video.";
      if (msg.toLowerCase().includes("unexpected response")) {
        setUploadError(
          "Ukuran video melebihi batas unggahan server. Gunakan video di bawah 4.5 MB atau tautan YouTube/Vimeo."
        );
      } else {
        setUploadError(msg);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Label & Tombol Bawaan */}
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="block text-[12.5px] font-medium text-[#0c0f1d]"
        >
          {label} <span className="text-[#185adb] ml-0.5">*</span>
        </label>

        {canRestoreDefault && (
          <button
            type="button"
            onClick={() => {
              setUploadError("");
              onChange(defaultValue);
              setActiveTab("upload");
            }}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zinc-500 hover:text-[#185adb] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Gunakan Video Bawaan</span>
          </button>
        )}
      </div>

      {/* Tab Switcher Hybrid (YouTube vs MP4 File) */}
      <div className="flex p-1 bg-[#f4f5f7] rounded-[14px] border border-zinc-200/80 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("youtube")}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-[11px] text-[12.5px] font-medium transition-all cursor-pointer",
            activeTab === "youtube"
              ? "bg-white text-[#0c0f1d] shadow-[0_2px_8px_rgba(12,15,29,0.06)]"
              : "text-zinc-500 hover:text-[#0c0f1d]"
          )}
        >
          <Link2 className="h-4 w-4 text-red-500" />
          <span>Tautan YouTube / Vimeo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-[11px] text-[12.5px] font-medium transition-all cursor-pointer",
            activeTab === "upload"
              ? "bg-white text-[#0c0f1d] shadow-[0_2px_8px_rgba(12,15,29,0.06)]"
              : "text-zinc-500 hover:text-[#0c0f1d]"
          )}
        >
          <Video className="h-4 w-4 text-[#185adb]" />
          <span>Upload File MP4 / Path Lokal</span>
        </button>
      </div>

      {/* Konten Tab 1: YouTube / Vimeo Link */}
      {activeTab === "youtube" && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          <div>
            <div className="relative">
              <input
                id={id}
                type="text"
                value={isExternalVideo ? value : ""}
                onChange={(e) => {
                  setUploadError("");
                  onChange(e.target.value);
                }}
                placeholder="misal: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau youtu.be/..."
                className={cn(
                  "block w-full rounded-[12px] border bg-[#f4f5f7] px-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:bg-white focus:outline-none transition-colors",
                  sanitized
                    ? "border-emerald-300 focus:border-emerald-500"
                    : "border-zinc-200/80 focus:border-[#185adb]"
                )}
              />
              {sanitized && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-600 text-[11.5px] font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="capitalize">{sanitized.platform} Terverifikasi</span>
                </div>
              )}
            </div>
            <p className="mt-1 text-[11.5px] text-zinc-500">
              Cukup salin tautan video dari YouTube atau Vimeo. Video akan diputar otomatis tanpa iklan/branding berlebih.
            </p>
          </div>

          {/* Pratinjau Video YouTube Terverifikasi */}
          {sanitized ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-black border border-zinc-200 shadow-sm">
              <iframe
                src={`${sanitized.embedUrl}?controls=1&modestbranding=1&rel=0`}
                title="Pratinjau Video YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="h-full w-full"
              />
            </div>
          ) : value && isExternalVideo === false && activeTab === "youtube" ? (
            <div className="p-3.5 rounded-[14px] bg-amber-50/60 border border-amber-200/80 text-[12px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Masukkan link YouTube atau Vimeo yang valid untuk melihat pratinjau embed player.
              </span>
            </div>
          ) : null}
        </div>
      )}

      {/* Konten Tab 2: Upload MP4 / Path Lokal */}
      {activeTab === "upload" && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="sr-only"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5 items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setUploadError("");
                onChange(e.target.value);
              }}
              placeholder="/videos/showcase.mp4 atau https://..."
              className="block w-full rounded-[12px] border border-zinc-200/80 bg-[#f4f5f7] px-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-zinc-200/90 bg-white hover:bg-zinc-50 px-4 py-2.5 text-[13px] font-medium text-[#0c0f1d] transition-colors cursor-pointer disabled:opacity-60 shrink-0"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#185adb]" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-[#185adb]" />
                  <span>Pilih Berkas MP4</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11.5px] text-zinc-500">
            {helperText} · Maksimal 50 MB
          </p>

          {/* Pratinjau Pemutar Video MP4 */}
          {value && !sanitized && (
            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-black border border-zinc-200 shadow-sm">
              <video
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
                src={value}
              >
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          )}
        </div>
      )}

      {/* Pesan Kesalahan */}
      {(uploadError || error) && (
        <p className="text-[12px] text-red-500 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{uploadError || error}</span>
        </p>
      )}
    </div>
  );
}
