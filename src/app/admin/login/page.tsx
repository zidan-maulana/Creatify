"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  Check,
  KeyRound,
} from "lucide-react";
import {
  DEFAULT_ADMIN_EMAIL,
  setStoredAdminEmail,
} from "@/components/admin/AdminCmsProvider";

function GoogleLogoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4.5 w-4.5 shrink-0"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("creatify2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || password.length < 6) {
      setError("Email atau kata sandi yang Anda masukkan tidak valid.");
      return;
    }

    setStoredAdminEmail(email.trim());
    setIsSubmitting(true);
    router.push("/admin");
  };

  const handleGoogleLogin = () => {
    setError("");
    setStoredAdminEmail(email.trim() || DEFAULT_ADMIN_EMAIL);
    setIsSubmitting(true);
    router.push("/admin");
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Masukkan email administrator terlebih dahulu.");
      return;
    }

    setResetSent(true);
  };

  const backButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/85 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-[#0c0f1d] transition-colors cursor-pointer";

  return (
    <main
      style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      className="relative min-h-screen w-full overflow-hidden bg-[#185adb] text-white flex items-center justify-center p-4 sm:p-6 selection:bg-white selection:text-[#185adb]"
    >
      {/* Ambient lighting selaras Hero landing page */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-36 -left-36 h-[560px] w-[560px] rounded-full bg-[#5293ff]/30 blur-[130px]" />
        <div className="absolute -bottom-36 -right-36 h-[560px] w-[560px] rounded-full bg-[#5293ff]/25 blur-[140px]" />
      </div>

      {/* Centered auth card mengadopsi komposisi referensi */}
      <div className="relative z-10 flex w-full items-center justify-center">
        <div className="w-full max-w-[410px] rounded-[26px] sm:rounded-[28px] bg-[#f4f5f7] p-1.5 shadow-[0_24px_60px_rgba(6,25,80,0.28)]">
          {/* Card putih utama */}
          <div className="relative rounded-[21px] sm:rounded-[23px] border border-zinc-200/70 bg-white px-6 sm:px-8 pt-8 pb-7 text-[#0c0f1d]">
            {viewMode === "forgot" ? (
              <button
                type="button"
                aria-label="Kembali ke form masuk"
                title="Kembali ke form masuk"
                onClick={() => {
                  setError("");
                  setResetSent(false);
                  setViewMode("login");
                }}
                className={`absolute left-5 top-5 ${backButtonClass}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/"
                aria-label="Kembali ke Website"
                title="Kembali ke Website"
                className={`absolute left-5 top-5 ${backButtonClass}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            {/* Ikon emblem tengah beserta cincin titik konsentris */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border border-dotted border-zinc-200/90"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-full border border-dotted border-zinc-300/80"
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#2a70f6] to-[#1348b5] shadow-[0_10px_24px_rgba(24,90,219,0.28)]">
                {viewMode === "forgot" ? (
                  <KeyRound className="h-5 w-5 text-white" />
                ) : (
                  <div className="h-5 w-5 rotate-45 rounded-[3px] bg-white flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#185adb]" />
                  </div>
                )}
              </div>
            </div>

            {viewMode === "login" ? (
              <>
                <div className="mt-4 text-center">
                  <h1 className="text-[22px] sm:text-[23px] font-semibold tracking-[-0.025em] text-[#0c0f1d]">
                    Masuk ke CMS Admin
                  </h1>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-zinc-500">
                    Silakan masuk untuk mengelola konten Creatify.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      id="admin-email"
                      type="email"
                      aria-label="Email Administrator"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Administrator"
                      className="block w-full rounded-[12px] border border-zinc-200/75 bg-[#f4f5f7] pl-10 pr-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      aria-label="Kata Sandi"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata Sandi"
                      className="block w-full rounded-[12px] border border-zinc-200/75 bg-[#f4f5f7] pl-10 pr-10 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? "Sembunyikan kata sandi"
                          : "Lihat kata sandi"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#0c0f1d] transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <p className="text-[12px] text-red-500 font-medium text-center pt-0.5">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-[12px] bg-[#185adb] hover:bg-[#1348b5] py-2.5 px-4 text-[13.5px] font-semibold text-white transition-colors duration-200 cursor-pointer select-none disabled:opacity-60"
                  >
                    {isSubmitting ? "Memproses..." : "Masuk"}
                  </button>
                </form>

                {/* Pemisah bertitik selaras referensi */}
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 border-t border-dashed border-zinc-200" />
                  <span className="text-[11.5px] font-medium text-zinc-400 whitespace-nowrap">
                    Atau lanjutkan dengan
                  </span>
                  <span className="h-px flex-1 border-t border-dashed border-zinc-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 rounded-[12px] border border-zinc-200/90 bg-white hover:bg-zinc-50 py-2.5 px-4 text-[13.5px] font-medium text-[#0c0f1d] transition-colors cursor-pointer select-none disabled:opacity-60"
                >
                  <GoogleLogoIcon />
                  <span>Masuk dengan Google</span>
                </button>
              </>
            ) : (
              <>
                <div className="mt-4 text-center">
                  <h1 className="text-[22px] sm:text-[23px] font-semibold tracking-[-0.025em] text-[#0c0f1d]">
                    Lupa Password
                  </h1>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-zinc-500">
                    Masukkan email admin untuk menerima tautan pemulihan.
                  </p>
                </div>

                {resetSent ? (
                  <div className="mt-6 rounded-[14px] border border-emerald-200/80 bg-emerald-50/70 p-4 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                      <Check className="h-4.5 w-4.5 stroke-[2.5]" />
                    </div>
                    <p className="mt-2.5 text-[13px] font-medium text-[#0c0f1d]">
                      Tautan reset dikirim
                    </p>
                    <p className="mt-1 text-[12px] leading-[1.5] text-zinc-500 break-all">
                      Periksa kotak masuk <span className="font-medium text-[#0c0f1d]">{email}</span> untuk mengatur ulang kata sandi.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="mt-6 space-y-3">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        id="reset-email"
                        type="email"
                        aria-label="Email Administrator"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Administrator"
                        className="block w-full rounded-[12px] border border-zinc-200/75 bg-[#f4f5f7] pl-10 pr-3.5 py-2.5 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    {error && (
                      <p className="text-[12px] text-red-500 font-medium text-center">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-[12px] bg-[#185adb] hover:bg-[#1348b5] py-2.5 px-4 text-[13.5px] font-semibold text-white transition-colors duration-200 cursor-pointer select-none"
                    >
                      Kirim Tautan Reset
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Footer bawah card menggantikan Sign Up menjadi Lupa Password */}
          <div className="py-3.5 px-4 text-center text-[12.5px] text-zinc-500">
            {viewMode === "login" ? (
              <>
                Kendala masuk ke akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setResetSent(false);
                    setViewMode("forgot");
                  }}
                  className="font-semibold text-[#0c0f1d] hover:text-[#185adb] transition-colors cursor-pointer"
                >
                  Lupa Password
                </button>
              </>
            ) : (
              <>
                Sudah ingat kata sandi?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setResetSent(false);
                    setViewMode("login");
                  }}
                  className="font-semibold text-[#0c0f1d] hover:text-[#185adb] transition-colors cursor-pointer"
                >
                  Kembali Masuk
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

