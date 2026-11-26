import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Konfigurasi & Pipeline Media Storage (Supabase Storage + Cloudinary + Local Fallback)
 * Sesuai ADR-004, 04_SYSTEM_DESIGN.md, dan BACKEND_JOBDESK.md
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (Gambar)
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB (Video MP4)

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

export function isSupabaseStorageActive(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
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

function getMimeType(fileName: string, defaultType: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    default:
      return defaultType;
  }
}

/**
 * Mengunggah berkas buffer ke Supabase Storage via REST API
 */
async function uploadToSupabaseStorage(
  buffer: Buffer,
  fileName: string,
  folder = "images",
  defaultType = "image/webp"
): Promise<UploadMediaResult> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
  ).replace(/\/+$/, "");
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "creatify-media";

  const ext =
    path.extname(fileName) ||
    (defaultType.startsWith("video") ? ".mp4" : ".webp");
  const uniqueId = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const filePath = `${folder}/${uniqueId}${ext}`;
  const contentType = getMimeType(fileName, defaultType);

  const endpoint = `${baseUrl}/storage/v1/object/${bucket}/${filePath}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      apikey: apiKey,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const errorText = await res.text();
    let msg = errorText;
    try {
      const parsed = JSON.parse(errorText);
      msg = parsed.message || parsed.error || errorText;
    } catch {}
    throw new Error(
      `Gagal mengunggah ke Supabase Storage (bucket: ${bucket}): ${msg}`
    );
  }

  const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
  return {
    url: publicUrl,
    publicId: `supabase:${bucket}/${filePath}`,
  };
}

/**
 * Mengunggah berkas buffer gambar (Supabase Storage -> Cloudinary -> Local Fallback)
 */
export async function uploadMediaBuffer(
  buffer: Buffer,
  fileName: string,
  folder = "creatify"
): Promise<UploadMediaResult> {
  // 1. Prioritaskan Supabase Storage jika dikonfigurasi
  if (isSupabaseStorageActive()) {
    return uploadToSupabaseStorage(buffer, fileName, folder, "image/webp");
  }

  // 2. Prioritaskan Cloudinary jika dikonfigurasi
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

  // 3. Lingkungan Serverless / Production (Vercel) tidak mendukung local disk writes
  const isServerlessOrProd = Boolean(
    process.env.VERCEL || process.env.NODE_ENV === "production"
  );
  if (isServerlessOrProd) {
    throw new Error(
      "Layanan penyimpanan cloud belum dikonfigurasi di Vercel. Harap tambahkan NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY (atau kredensial Cloudinary) pada Environment Variables Vercel."
    );
  }

  // 4. Local Storage Fallback khusus lingkungan lokal (localhost)
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
 * Mengunggah berkas buffer video (Supabase Storage -> Cloudinary -> Local Fallback)
 */
export async function uploadVideoBuffer(
  buffer: Buffer,
  fileName: string,
  folder = "creatify/videos"
): Promise<UploadMediaResult> {
  // 1. Prioritaskan Supabase Storage jika dikonfigurasi
  if (isSupabaseStorageActive()) {
    return uploadToSupabaseStorage(buffer, fileName, folder, "video/mp4");
  }

  // 2. Prioritaskan Cloudinary jika dikonfigurasi
  if (isCloudinaryActive()) {
    return new Promise<UploadMediaResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "video",
        },
        (error, result) => {
          if (error || !result) {
            reject(
              new Error(
                error?.message || "Gagal mengunggah video ke Cloudinary."
              )
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

  // 3. Lingkungan Serverless / Production (Vercel)
  const isServerlessOrProd = Boolean(
    process.env.VERCEL || process.env.NODE_ENV === "production"
  );
  if (isServerlessOrProd) {
    throw new Error(
      "Layanan penyimpanan cloud belum dikonfigurasi di Vercel. Harap tambahkan NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY (atau kredensial Cloudinary) pada Environment Variables Vercel."
    );
  }

  // 4. Local Storage Fallback untuk berkas video khusus lingkungan lokal (localhost)
  const ext = path.extname(fileName) || ".mp4";
  const uniqueId = `video-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
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

    if (publicId.startsWith("supabase:")) {
      const rawPath = publicId.replace(/^supabase:/, "");
      const slashIdx = rawPath.indexOf("/");
      if (slashIdx === -1) return true;
      const bucket = rawPath.slice(0, slashIdx);
      const filePath = rawPath.slice(slashIdx + 1);

      const baseUrl = (
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
      ).replace(/\/+$/, "");
      const apiKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "";

      if (!baseUrl || !apiKey) return true;

      await fetch(`${baseUrl}/storage/v1/object/${bucket}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          apikey: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes: [filePath] }),
      });
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
