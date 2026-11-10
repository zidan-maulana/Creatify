"use client";

import React, { useState } from "react";
import {
  DEFAULT_LANDING_CONTENT,
  LANDING_CONTENT_LIMITS,
  landingContentSchema,
} from "@/config/landing-cms";
import {
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/AdminField";
import { AdminImageUpload } from "@/components/admin/AdminImageUpload";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";
import { mapZodIssues } from "@/components/admin/editors/validation";
import { LANDING_FORM_IDS } from "@/config/admin-landing-sections";
import type { AboutContent, HeroContent, MarqueeContent } from "@/types/cms";

export function HeroEditor() {
  const { landingContent, updateHero, showToast } = useAdminCms();
  const [form, setForm] = useState<HeroContent>(landingContent.hero);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = landingContentSchema.shape.hero.safeParse(form);
    if (!result.success) {
      setErrors(mapZodIssues(result.error));
      showToast(
        "error",
        "Periksa batas karakter atau kalimat pada section Hero."
      );
      return;
    }
    setErrors({});
    updateHero(result.data);
  };

  return (
    <form id={LANDING_FORM_IDS.hero} onSubmit={handleSave} className="space-y-6">
      {/* Card 1: Teks & Tombol CTA */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Teks &amp; Tombol Hero
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Headline dikunci 2 baris simetris di desktop.
          </p>
        </div>

        <AdminTextField
          id="hero-badge"
          label="Teks Status Badge"
          value={form.badgeText}
          onChange={(v) => setForm((p) => ({ ...p, badgeText: v }))}
          limit={LANDING_CONTENT_LIMITS.hero.badgeText}
          error={errors.badgeText}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="hero-headline-1"
            label="Headline Utama — Baris 1"
            value={form.headlineLine1}
            onChange={(v) => setForm((p) => ({ ...p, headlineLine1: v }))}
            limit={LANDING_CONTENT_LIMITS.hero.headlineLine1}
            error={errors.headlineLine1}
            required
          />
          <AdminTextField
            id="hero-headline-2"
            label="Headline Utama — Baris 2"
            value={form.headlineLine2}
            onChange={(v) => setForm((p) => ({ ...p, headlineLine2: v }))}
            limit={LANDING_CONTENT_LIMITS.hero.headlineLine2}
            error={errors.headlineLine2}
            required
          />
        </div>

        <AdminTextareaField
          id="hero-subheadline"
          label="Sub-headline Pengantar"
          rows={2}
          value={form.subheadline}
          onChange={(v) => setForm((p) => ({ ...p, subheadline: v }))}
          limit={LANDING_CONTENT_LIMITS.hero.subheadline}
          error={errors.subheadline}
          helperText="Gunakan maksimal 1 kalimat ringkas (maks 2 baris visual)."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="hero-cta-primary"
            label="Tombol CTA Utama (Putih)"
            value={form.primaryCtaLabel}
            onChange={(v) => setForm((p) => ({ ...p, primaryCtaLabel: v }))}
            limit={LANDING_CONTENT_LIMITS.hero.primaryCtaLabel}
            error={errors.primaryCtaLabel}
            required
          />
          <AdminTextField
            id="hero-cta-secondary"
            label="Tombol CTA Sekunder"
            value={form.secondaryCtaLabel}
            onChange={(v) => setForm((p) => ({ ...p, secondaryCtaLabel: v }))}
            limit={LANDING_CONTENT_LIMITS.hero.secondaryCtaLabel}
            error={errors.secondaryCtaLabel}
            required
          />
        </div>
      </div>

      {/* Card 2 (Terpisah di bawah Card 1): Media Video Showcase */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Media Showcase Hero
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Video showcase yang tampil pada bagian bawah Hero.
          </p>
        </div>

        <AdminTextField
          id="hero-video-url"
          label="Path / URL Video Showcase (MP4)"
          value={form.videoUrl}
          onChange={(v) => setForm((p) => ({ ...p, videoUrl: v }))}
          error={errors.videoUrl}
          placeholder="/videos/showcase.mp4"
          required
        />
      </div>
    </form>
  );
}

export function MarqueeAboutEditor() {
  const { landingContent, updateMarquee, updateAbout, showToast } =
    useAdminCms();
  const [marquee, setMarquee] = useState<MarqueeContent>(
    landingContent.marquee
  );
  const [about, setAbout] = useState<AboutContent>(landingContent.about);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const resMarquee = landingContentSchema.shape.marquee.safeParse(marquee);
    const resAbout = landingContentSchema.shape.about.safeParse(about);

    if (!resMarquee.success || !resAbout.success) {
      const mergedErrors: Record<string, string> = {};
      if (!resMarquee.success) {
        Object.assign(mergedErrors, mapZodIssues(resMarquee.error));
      }
      if (!resAbout.success) {
        Object.assign(mergedErrors, mapZodIssues(resAbout.error));
      }
      setErrors(mergedErrors);
      showToast(
        "error",
        "Periksa kembali batas karakter/kalimat pada Marquee & Tentang."
      );
      return;
    }

    setErrors({});
    updateMarquee(resMarquee.data);
    updateAbout(resAbout.data);
  };

  return (
    <form
      id={LANDING_FORM_IDS.tentang}
      onSubmit={handleSave}
      className="space-y-6"
    >
      {/* Bar Marquee */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7">
        <AdminTextField
          id="marquee-trust-label"
          label="Label Kemitraan Marquee Logo"
          value={marquee.trustLabel}
          onChange={(v) => setMarquee({ trustLabel: v })}
          limit={LANDING_CONTENT_LIMITS.marquee.trustLabel}
          error={errors.trustLabel}
          required
        />
      </div>

      {/* Card Headline & Profil Tentang */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Headline Editorial Tentang (4 Baris)
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Susunan kata mengapit 2 foto kapsul pada baris 1 dan baris 3.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="about-l1-before"
            label="Baris 1 (Sebelum Pill 1)"
            value={about.headlineLine1Before}
            onChange={(v) =>
              setAbout((p) => ({ ...p, headlineLine1Before: v }))
            }
            limit={LANDING_CONTENT_LIMITS.about.headlineLine1Before}
            error={errors.headlineLine1Before}
            required
          />
          <AdminTextField
            id="about-l1-after"
            label="Baris 1 (Sesudah Pill 1)"
            value={about.headlineLine1After}
            onChange={(v) =>
              setAbout((p) => ({ ...p, headlineLine1After: v }))
            }
            limit={LANDING_CONTENT_LIMITS.about.headlineLine1After}
            error={errors.headlineLine1After}
            required
          />
        </div>

        <AdminTextField
          id="about-l2"
          label="Baris 2"
          value={about.headlineLine2}
          onChange={(v) => setAbout((p) => ({ ...p, headlineLine2: v }))}
          limit={LANDING_CONTENT_LIMITS.about.headlineLine2}
          error={errors.headlineLine2}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="about-l3-before"
            label="Baris 3 (Sebelum Pill 2)"
            value={about.headlineLine3Before}
            onChange={(v) =>
              setAbout((p) => ({ ...p, headlineLine3Before: v }))
            }
            limit={LANDING_CONTENT_LIMITS.about.headlineLine3Before}
            error={errors.headlineLine3Before}
            required
          />
          <AdminTextField
            id="about-l3-after"
            label="Baris 3 (Sesudah Pill 2)"
            value={about.headlineLine3After}
            onChange={(v) =>
              setAbout((p) => ({ ...p, headlineLine3After: v }))
            }
            limit={LANDING_CONTENT_LIMITS.about.headlineLine3After}
            error={errors.headlineLine3After}
            required
          />
        </div>

        <AdminTextField
          id="about-l4"
          label="Baris 4 (Penutup)"
          value={about.headlineLine4}
          onChange={(v) => setAbout((p) => ({ ...p, headlineLine4: v }))}
          limit={LANDING_CONTENT_LIMITS.about.headlineLine4}
          error={errors.headlineLine4}
          required
        />

        <div className="pt-2 border-t border-zinc-200/70 space-y-4">
          <AdminTextareaField
            id="about-description"
            label="Narasi Profil (Kolom Kanan Publik)"
            rows={4}
            value={about.description}
            onChange={(v) => setAbout((p) => ({ ...p, description: v }))}
            limit={LANDING_CONTENT_LIMITS.about.description}
            error={errors.description}
            required
          />

          <AdminTextField
            id="about-cta"
            label="Label Tombol Menuju Halaman Tim"
            value={about.ctaLabel}
            onChange={(v) => setAbout((p) => ({ ...p, ctaLabel: v }))}
            limit={LANDING_CONTENT_LIMITS.about.ctaLabel}
            error={errors.ctaLabel}
            required
          />
        </div>
      </div>

      {/* 2 Card Terpisah untuk Foto Kapsul Editorial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
        <div className="h-full rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-5">
          <div className="pb-3 border-b border-zinc-200/70">
            <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Foto Kapsul Editorial 1
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              Tampil sejajar di tengah baris pertama kalimat headline.
            </p>
          </div>

          <AdminImageUpload
            id="about-pill-1-url"
            label="Foto Pill 1 (Baris 1)"
            value={about.pillImage1Url}
            defaultValue={DEFAULT_LANDING_CONTENT.about.pillImage1Url}
            onChange={(v) => setAbout((p) => ({ ...p, pillImage1Url: v }))}
            aspectClass="aspect-[2/1]"
            error={errors.pillImage1Url}
            required
          />
        </div>

        <div className="h-full rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-5">
          <div className="pb-3 border-b border-zinc-200/70">
            <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Foto Kapsul Editorial 2
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              Tampil sejajar di tengah baris ketiga kalimat headline.
            </p>
          </div>

          <AdminImageUpload
            id="about-pill-2-url"
            label="Foto Pill 2 (Baris 3)"
            value={about.pillImage2Url}
            defaultValue={DEFAULT_LANDING_CONTENT.about.pillImage2Url}
            onChange={(v) => setAbout((p) => ({ ...p, pillImage2Url: v }))}
            aspectClass="aspect-[2/1]"
            error={errors.pillImage2Url}
            required
          />
        </div>
      </div>
    </form>
  );
}
