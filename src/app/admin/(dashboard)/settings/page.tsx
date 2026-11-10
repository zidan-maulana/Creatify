"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  LANDING_CONTENT_LIMITS,
  siteSettingsSchema,
} from "@/config/landing-cms";
import {
  AdminConfirmModal,
  AdminSectionHeader,
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/AdminField";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";
import { mapZodIssues } from "@/components/admin/editors/validation";
import type { SiteSettingsContent } from "@/types/cms";

const SITE_SETTINGS_FORM_ID = "site-settings-form";

export default function AdminSettingsPage() {
  const {
    landingContent,
    adminEmail: storedAdminEmail,
    isHydrated,
    updateSiteSettings,
    updateAdminEmail,
    resetAllToDefault,
    showToast,
  } = useAdminCms();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Kontak & Pengaturan Situs"
        description="Atur identitas brand, SEO, kanal kontak resmi, serta akun admin."
        actions={
          <button
            type="submit"
            form={SITE_SETTINGS_FORM_ID}
            className="inline-flex items-center justify-center rounded-full bg-[#185adb] hover:bg-[#1348b5] px-6 py-2.5 text-[14px] font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Simpan Perubahan
          </button>
        }
      />

      <SiteSettingsForm
        key={`${isHydrated}-${landingContent.siteSettings.name}-${landingContent.siteSettings.email}`}
        initialSettings={landingContent.siteSettings}
        onSave={updateSiteSettings}
        onValidationError={() =>
          showToast(
            "error",
            "Periksa format email, URL, atau batas karakter pada pengaturan situs."
          )
        }
        accountCard={
          <AdminAccountForm
            key={`${isHydrated}-${storedAdminEmail}`}
            initialEmail={storedAdminEmail}
            onSaveEmail={updateAdminEmail}
            onValidationError={(msg) => showToast("error", msg)}
          />
        }
      />

      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Pulihkan Konten Bawaan
          </h2>
          <p className="mt-1 text-[13px] leading-[1.6] text-zinc-500">
            Kembalikan seluruh perubahan draft landing page, daftar tim, dan
            pengaturan kontak ke versi awal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200/90 bg-[#f4f5f7] hover:bg-zinc-200/70 px-5 py-2.5 text-[13.5px] font-medium text-[#0c0f1d] transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="h-4 w-4 text-[#185adb]" />
          <span>Reset Semua Konten Default</span>
        </button>
      </div>

      <AdminConfirmModal
        open={confirmResetOpen}
        title="Kembalikan Semua Konten Default?"
        description="Seluruh perubahan draft CMS pada landing page, tim, dan kontak akan di-reset ke data bawaan awal."
        confirmLabel="Ya, Reset Default"
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          resetAllToDefault();
          setConfirmResetOpen(false);
        }}
      />
    </div>
  );
}


function SiteSettingsForm({
  initialSettings,
  onSave,
  onValidationError,
  accountCard,
}: {
  initialSettings: SiteSettingsContent;
  onSave: (settings: SiteSettingsContent) => void;
  onValidationError: () => void;
  accountCard: React.ReactNode;
}) {
  const [form, setForm] = useState<SiteSettingsContent>(initialSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const res = siteSettingsSchema.safeParse(form);
    if (!res.success) {
      setErrors(mapZodIssues(res.error));
      onValidationError();
      return;
    }
    setErrors({});
    onSave(res.data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Baris 1 Kiri: Identitas Brand & Metadata SEO */}
      <form
        id={SITE_SETTINGS_FORM_ID}
        onSubmit={handleSaveSiteSettings}
        className="h-full rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-4"
      >
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Identitas Brand &amp; Metadata SEO
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Nama brand, tombol navbar, serta judul dan deskripsi SEO situs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="site-brand-name"
            label="Nama Brand"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            limit={LANDING_CONTENT_LIMITS.siteSettings.name}
            error={errors.name}
            required
          />
          <AdminTextField
            id="site-navbar-cta"
            label="CTA Navbar"
            value={form.navbarCtaLabel}
            onChange={(v) => setForm((p) => ({ ...p, navbarCtaLabel: v }))}
            limit={LANDING_CONTENT_LIMITS.siteSettings.navbarCtaLabel}
            error={errors.navbarCtaLabel}
            required
          />
        </div>

        <AdminTextField
          id="site-meta-title"
          label="Judul Tab Browser (SEO Title)"
          value={form.title}
          onChange={(v) => setForm((p) => ({ ...p, title: v }))}
          limit={LANDING_CONTENT_LIMITS.siteSettings.title}
          error={errors.title}
          required
        />

        <AdminTextareaField
          id="site-meta-desc"
          label="Deskripsi Metadata SEO"
          rows={2}
          value={form.description}
          onChange={(v) => setForm((p) => ({ ...p, description: v }))}
          limit={LANDING_CONTENT_LIMITS.siteSettings.description}
          error={errors.description}
          required
        />
      </form>

      {/* Baris 1 Kanan: Kanal Kontak & Media Sosial */}
      <section className="h-full rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-4">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Kanal Kontak &amp; Media Sosial
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Terhubung langsung ke FAQ, Rekrutmen, dan Footer halaman publik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="site-email"
            form={SITE_SETTINGS_FORM_ID}
            type="email"
            label="Email Resmi"
            value={form.email}
            onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            limit={LANDING_CONTENT_LIMITS.siteSettings.email}
            error={errors.email}
            required
          />
          <AdminTextField
            id="site-ig-handle"
            form={SITE_SETTINGS_FORM_ID}
            label="Username IG"
            value={form.instagramHandle}
            onChange={(v) => setForm((p) => ({ ...p, instagramHandle: v }))}
            limit={LANDING_CONTENT_LIMITS.siteSettings.instagramHandle}
            error={errors.instagramHandle}
            required
          />
        </div>

        <AdminTextField
          id="site-ig-url"
          form={SITE_SETTINGS_FORM_ID}
          type="url"
          label="URL Profil Instagram"
          value={form.instagramUrl}
          onChange={(v) => setForm((p) => ({ ...p, instagramUrl: v }))}
          error={errors.instagramUrl}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="site-tiktok-url"
            form={SITE_SETTINGS_FORM_ID}
            type="url"
            label="URL TikTok"
            value={form.tiktokUrl}
            onChange={(v) => setForm((p) => ({ ...p, tiktokUrl: v }))}
            error={errors.tiktokUrl}
            required
          />
          <AdminTextField
            id="site-youtube-url"
            form={SITE_SETTINGS_FORM_ID}
            type="url"
            label="URL YouTube"
            value={form.youtubeUrl}
            onChange={(v) => setForm((p) => ({ ...p, youtubeUrl: v }))}
            error={errors.youtubeUrl}
            required
          />
        </div>
      </section>

      {/* Baris 2 Kiri: Informasi Sekretariat */}
      <section className="h-full rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 flex flex-col gap-4">
        <div className="pb-4 border-b border-zinc-200/70 shrink-0">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Informasi Sekretariat
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Ditampilkan pada detail kontak rekrutmen dan kolom kanan footer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
          <AdminTextField
            id="sec-short"
            form={SITE_SETTINGS_FORM_ID}
            label="Label Singkat"
            value={form.secretariat.shortLabel}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                secretariat: { ...p.secretariat, shortLabel: v },
              }))
            }
            limit={LANDING_CONTENT_LIMITS.siteSettings.secretariatShortLabel}
            error={errors["secretariat.shortLabel"]}
            required
          />
          <AdminTextField
            id="sec-faculty"
            form={SITE_SETTINGS_FORM_ID}
            label="Nama Fakultas"
            value={form.secretariat.faculty}
            onChange={(v) =>
              setForm((p) => ({
                ...p,
                secretariat: { ...p.secretariat, faculty: v },
              }))
            }
            limit={LANDING_CONTENT_LIMITS.siteSettings.secretariatFaculty}
            error={errors["secretariat.faculty"]}
            required
          />
        </div>

        <AdminTextareaField
          id="sec-address"
          form={SITE_SETTINGS_FORM_ID}
          label="Alamat Lengkap Sekretariat"
          rows={3}
          fillHeight
          value={form.secretariat.address}
          onChange={(v) =>
            setForm((p) => ({
              ...p,
              secretariat: { ...p.secretariat, address: v },
            }))
          }
          limit={LANDING_CONTENT_LIMITS.siteSettings.secretariatAddress}
          error={errors["secretariat.address"]}
          required
        />
      </section>

      {/* Baris 2 Kanan: Akun Administrator */}
      {accountCard}
    </div>
  );
}

function AdminAccountForm({
  initialEmail,
  onSaveEmail,
  onValidationError,
}: {
  initialEmail: string;
  onSaveEmail: (email: string) => void;
  onValidationError: (message: string) => void;
}) {
  const [adminEmail, setAdminEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      onValidationError("Masukkan kata sandi lama untuk verifikasi.");
      return;
    }
    if (newPassword.length < 8) {
      onValidationError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      onValidationError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    onSaveEmail(adminEmail.trim());
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form
      id="akun"
      onSubmit={handleSaveAccount}
      className="scroll-mt-8 h-full flex flex-col justify-between rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-5"
    >
      <div className="space-y-4">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Akun Administrator
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Perbarui email masuk atau kata sandi panel CMS Creatify.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="acc-email"
            type="email"
            label="Email Administrator"
            value={adminEmail}
            onChange={setAdminEmail}
            required
          />

          <AdminTextField
            id="acc-old-pass"
            type="password"
            label="Kata Sandi Lama"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Masukkan kata sandi aktif"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="acc-new-pass"
            type="password"
            label="Kata Sandi Baru"
            value={newPassword}
            onChange={setNewPassword}
            helperText="Min. 8 karakter (huruf & angka)."
            required
          />

          <AdminTextField
            id="acc-confirm-pass"
            type="password"
            label="Konfirmasi Kata Sandi"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />
        </div>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          className="w-full rounded-full bg-[#185adb] hover:bg-[#1348b5] px-6 py-2.5 text-[14px] font-medium text-white transition-colors cursor-pointer"
        >
          Perbarui Kredensial
        </button>
      </div>
    </form>
  );
}
