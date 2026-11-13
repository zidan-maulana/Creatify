import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Konfigurasi & Pipeline Media Storage (Cloudinary + Local Resilient Fallback)
 * Sesuai ADR-004, 04_SYSTEM_DESIGN.md, dan BACKEND_JOBDESK.md
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface UploadMediaResult {
  url: string;
  publicId: string;
}

export function isCloudinaryActive(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

// Inisialisasi konfigurasi Cloudinary jika variabel lingkungan terisi
if (isCloudinaryActive()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Mengunggah berkas buffer gambar ke Cloudinary (atau local fallback jika belum diatur)
 */
export async function uploadMediaBuffer(
  buffer: Buffer,
  fileName: string,
  folder = "creatify"
): Promise<UploadMediaResult> {
  if (isCloudinaryActive()) {
    return new Promise<UploadMediaResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error || new Error("Gagal mengunggah media ke Cloudinary.")
            );
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Local Storage Fallback: Menyimpan secara aman ke public/uploads/
  // Mencegah error saat developer belum mengisi API key Cloudinary
  const ext = path.extname(fileName) || ".webp";
  const uniqueId = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const targetFileName = `${uniqueId}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadsDir, { recursive: true });
  const targetPath = path.join(uploadsDir, targetFileName);
  await fs.writeFile(targetPath, buffer);

  return {
    url: `/uploads/${targetFileName}`,
    publicId: `local:${targetFileName}`,
  };
}

/**
 * Menghapus aset gambar lama untuk mencegah kebocoran kuota penyimpanan (Zero Storage Leak)
 */
export async function deleteMediaAsset(publicId: string): Promise<boolean> {
  if (!publicId) return true;

  try {
    if (publicId.startsWith("local:")) {
      const fileName = publicId.replace("local:", "");
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await fs.unlink(filePath).catch(() => {});
      return true;
    }

    if (isCloudinaryActive()) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok" || result.result === "not found";
    }

    return true;
  } catch (error) {
    console.error(`[Media] Gagal menghapus media publicId ${publicId}:`, error);
    return false;
  }
}

