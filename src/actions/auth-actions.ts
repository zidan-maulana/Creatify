"use server";

import { db } from "@/lib/db";
import {
  signSessionToken,
  setSessionCookie,
  deleteSessionCookie,
  getSessionFromCookie,
  verifyPassword,
  hashPassword,
} from "@/lib/auth";
import {
  loginSchema,
  changeCredentialsSchema,
  type LoginInput,
  type ChangeCredentialsInput,
} from "@/lib/validations/auth";
import {
  successResponse,
  errorResponse,
  type ApiResponse,
} from "@/types/api";

/**
 * Server Action: Login Administrator
 * Sesuai Dokumen 09_API_CONTRACT.md Bagian 3.1
 */
export async function loginAction(
  input: LoginInput
): Promise<ApiResponse<{ user: { id: string; email: string } }>> {
  try {
    const parseResult = loginSchema.safeParse(input);
    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const field = issue.path.join(".");
        if (!details[field]) details[field] = [];
        details[field].push(issue.message);
      }
      return errorResponse(
        "VALIDATION_ERROR",
        "Data masukan login tidak valid.",
        details
      );
    }

    const { email, password } = parseResult.data;

    // Cari akun administrator di basis data
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(
        "INVALID_CREDENTIALS",
        "Email atau kata sandi yang Anda masukkan salah."
      );
    }

    // Verifikasi kata sandi
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse(
        "INVALID_CREDENTIALS",
        "Email atau kata sandi yang Anda masukkan salah."
      );
    }

    // Terbitkan token sesi dan pasang HTTP-Only cookie
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
    });
    await setSessionCookie(token);

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      "Login berhasil."
    );
  } catch (error) {
    console.error("[AuthAction] Galat login:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi kendala pada server saat memproses login. Silakan coba beberapa saat lagi."
    );
  }
}

/**
 * Server Action: Logout Administrator
 * Menghapus cookie sesi HTTP-Only
 */
export async function logoutAction(): Promise<ApiResponse<null>> {
  try {
    await deleteSessionCookie();
    return successResponse(null, "Berhasil keluar dari sesi admin.");
  } catch (error) {
    console.error("[AuthAction] Galat logout:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal menghapus sesi. Silakan coba kembali."
    );
  }
}

/**
 * Server Action: Ambil data sesi administrator saat ini
 */
export async function getCurrentAdminAction(): Promise<
  ApiResponse<{ id: string; email: string } | null>
> {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return successResponse(null);
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      await deleteSessionCookie();
      return successResponse(null);
    }

    return successResponse(user);
  } catch (error) {
    console.error("[AuthAction] Galat getCurrentAdmin:", error);
    return errorResponse("INTERNAL_ERROR", "Gagal memeriksa status sesi.");
  }
}

/**
 * Server Action: Perbarui kredensial akun administrator (Email & Kata Sandi)
 * Digunakan di /admin/settings (#akun)
 */
export async function changeCredentialsAction(
  input: ChangeCredentialsInput
): Promise<ApiResponse<{ email: string }>> {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi Anda telah kedaluwarsa. Silakan masuk kembali."
      );
    }

    const parseResult = changeCredentialsSchema.safeParse(input);
    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const field = issue.path.join(".");
        if (!details[field]) details[field] = [];
        details[field].push(issue.message);
      }
      return errorResponse(
        "VALIDATION_ERROR",
        "Data perubahan kredensial tidak valid.",
        details
      );
    }

    const { currentPassword, newPassword, newEmail } = parseResult.data;

    // Ambil akun user aktif
    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      await deleteSessionCookie();
      return errorResponse("NOT_FOUND", "Akun administrator tidak ditemukan.");
    }

    // Verifikasi kata sandi lama
    const isCurrentPasswordCorrect = await verifyPassword(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordCorrect) {
      return errorResponse(
        "INVALID_CREDENTIALS",
        "Kata sandi saat ini yang Anda masukkan salah."
      );
    }

    // Jika ingin mengganti email, pastikan email baru belum terpakai akun lain
    const targetEmail = newEmail && newEmail !== user.email ? newEmail : user.email;
    if (newEmail && newEmail !== user.email) {
      const existingUser = await db.user.findUnique({
        where: { email: newEmail },
      });
      if (existingUser && existingUser.id !== user.id) {
        return errorResponse(
          "CONFLICT",
          "Alamat email baru sudah terdaftar di sistem."
        );
      }
    }

    // Hash kata sandi baru
    const newPasswordHash = await hashPassword(newPassword);

    // Update data di database
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        email: targetEmail,
        passwordHash: newPasswordHash,
      },
    });

    // Perbarui token sesi dengan email baru
    const newToken = await signSessionToken({
      userId: updatedUser.id,
      email: updatedUser.email,
    });
    await setSessionCookie(newToken);

    return successResponse(
      { email: updatedUser.email },
      "Kredensial administrator berhasil diperbarui."
    );
  } catch (error) {
    console.error("[AuthAction] Galat ganti kredensial:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi kendala saat memperbarui kredensial. Silakan coba kembali."
    );
  }
}

