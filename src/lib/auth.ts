import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE_NAME = "creatify_admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 hari

export interface AuthSessionUser {
  userId: string;
  email: string;
}

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[Security Error] AUTH_SECRET wajib didefinisikan pada lingkungan produksi!"
      );
    }
    return new TextEncoder().encode(
      "dev-fallback-secret-creatify-digital-portfolio-2026-min-32-chars"
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Menghasilkan token JWT terenkripsi untuk sesi administrator
 */
export async function signSessionToken(payload: AuthSessionUser): Promise<string> {
  const secretKey = getAuthSecret();
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Memverifikasi integritas dan masa berlaku token JWT
 */
export async function verifySessionToken(
  token: string
): Promise<AuthSessionUser | null> {
  try {
    const secretKey = getAuthSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan token sesi ke dalam cookie HTTP-Only terproteksi
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Menghapus cookie sesi saat administrator logout
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Mengambil data sesi pengguna dari request context aktif
 */
export async function getSessionFromCookie(): Promise<AuthSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export const verifySessionCookie = getSessionFromCookie;
export const getCurrentAdminSession = getSessionFromCookie;

/**
 * Utilitas hashing kata sandi administrator (Bcrypt salt rounds 12)
 */
export async function hashPassword(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, 12);
}

/**
 * Utilitas verifikasi kecocokan kata sandi
 */
export async function verifyPassword(
  plainText: string,
  hashedText: string
): Promise<boolean> {
  return await bcrypt.compare(plainText, hashedText);
}

