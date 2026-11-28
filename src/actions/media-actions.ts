"use server";

import { getSessionFromCookie } from "@/lib/auth";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  isSupabaseStorageActive,
  createSupabaseSignedUploadUrl,
  uploadMediaBuffer,
  uploadVideoBuffer,
  deleteMediaAsset,
  type SignedUploadResult,
  type UploadMediaResult,
} from "@/lib/media";
import {
  successResponse,
  errorResponse,
  type ApiResponse,
} from "@/types/api";

/**
 * Server Action: Unggah Berkas Media Gambar
 * Sesuai Dokumen 09_API_CONTRACT.md Bagian 4.1 dan ADR-004
 */
export async function uploadMediaAction(
  formData: FormData
): Promise<ApiResponse<UploadMediaResult>> {
  try {
    // 1. Verifikasi Sesi Administrator
    const session = await getSessionFromCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Anda harus masuk sebagai administrator untuk mengunggah media."
      );
    }

    // 2. Ambil berkas dari FormData
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Berkas gambar tidak ditemukan pada permintaan unggah."
      );
    }

    // 3. Validasi Tipe MIME
    const isValidType = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(
      file.type
    );
    if (!isValidType) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Format berkas tidak didukung. Gunakan format JPG, PNG, atau WEBP."
      );
    }

    // 4. Validasi Ukuran Berkas
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Ukuran gambar melebihi batas maksimal yang diizinkan (5 MB)."
      );
    }

    // 5. Konversi File ke Buffer dan Eksekusi Unggah
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await uploadMediaBuffer(buffer, file.name);

    return successResponse(result, "Gambar berhasil diunggah.");
  } catch (error) {
    console.error("[MediaAction] Galat unggah:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kendala pada server saat memproses unggah media.";
    return errorResponse("INTERNAL_ERROR", message);
  }
}

/**
 * Server Action: Hapus Aset Media (Pencegahan Storage Leak)
 */
export async function deleteMediaAction(
  publicId: string
): Promise<ApiResponse<null>> {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Anda harus masuk sebagai administrator untuk menghapus media."
      );
    }

    if (!publicId) {
      return errorResponse("VALIDATION_ERROR", "ID aset media tidak valid.");
    }

    await deleteMediaAsset(publicId);
    return successResponse(null, "Aset media berhasil dihapus.");
  } catch (error) {
    console.error("[MediaAction] Galat hapus media:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal menghapus aset media dari storage."
    );
  }
}

export type CreateSignedVideoUploadResult =
  | SignedUploadResult
  | { useServerUpload: true };

/**
 * Server Action: Buat Signed Upload URL untuk Video MP4/WebM/MOV (Direct-to-Supabase)
 * Menghindari batas body payload 4.5 MB pada Serverless Function Vercel.
 */
export async function createSignedVideoUploadAction(
  fileName: string,
  fileType: string,
  fileSize: number
): Promise<ApiResponse<CreateSignedVideoUploadResult>> {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Anda harus masuk sebagai administrator untuk mengunggah berkas video."
      );
    }

    const lowerName = fileName.toLowerCase();
    const isValidType =
      (ACCEPTED_VIDEO_TYPES as readonly string[]).includes(fileType) ||
      (!fileType &&
        (lowerName.endsWith(".mp4") ||
          lowerName.endsWith(".webm") ||
          lowerName.endsWith(".mov")));
    if (!isValidType) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Format berkas tidak didukung. Gunakan format MP4, WebM, atau MOV."
      );
    }

    if (!fileSize || fileSize > MAX_VIDEO_SIZE_BYTES) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Ukuran video melebihi batas maksimal 50 MB."
      );
    }

    if (isSupabaseStorageActive()) {
      const signed = await createSupabaseSignedUploadUrl(
        fileName,
        "creatify/videos",
        fileType || "video/mp4"
      );
      return successResponse(signed, "Signed upload URL video siap digunakan.");
    }

    return successResponse(
      { useServerUpload: true },
      "Menggunakan unggahan melalui server."
    );
  } catch (error) {
    console.error("[MediaAction] Galat membuat signed upload video:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kendala pada server saat menyiapkan unggah video.";
    return errorResponse("INTERNAL_ERROR", message);
  }
}

/**
 * Server Action: Unggah Berkas Media Video MP4 / WebM
 */
export async function uploadVideoAction(
  formData: FormData
): Promise<ApiResponse<UploadMediaResult>> {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Anda harus masuk sebagai administrator untuk mengunggah berkas video."
      );
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Berkas video tidak ditemukan pada permintaan unggah."
      );
    }

    const isValidType = (ACCEPTED_VIDEO_TYPES as readonly string[]).includes(
      file.type
    );
    if (!isValidType) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Format berkas tidak didukung. Gunakan format MP4 atau WebM."
      );
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Ukuran video melebihi batas maksimal 50 MB."
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadVideoBuffer(buffer, file.name);
    return successResponse(result, "Berkas video berhasil diunggah.");
  } catch (error) {
    console.error("[MediaAction] Galat unggah video:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kendala pada server saat memproses unggah video.";
    return errorResponse("INTERNAL_ERROR", message);
  }
}

