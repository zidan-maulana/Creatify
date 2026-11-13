import { z } from "zod";

/**
 * Skema validasi masukan autentikasi (Zod)
 * Sesuai Dokumen 09_API_CONTRACT.md dan ADR-003
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email administrator wajib diisi.")
    .email("Format email yang Anda masukkan tidak valid.")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changeCredentialsSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Kata sandi lama wajib diisi."),
    newPassword: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter."),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi kata sandi baru minimal 8 karakter."),
    newEmail: z
      .string()
      .email("Format email baru tidak valid.")
      .trim()
      .toLowerCase()
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi baru tidak cocok.",
    path: ["confirmPassword"],
  });

export type ChangeCredentialsInput = z.infer<typeof changeCredentialsSchema>;
