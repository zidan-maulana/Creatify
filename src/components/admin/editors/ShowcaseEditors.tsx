"use client";

import React, { useMemo, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
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
import { useDirtyTracker } from "@/components/admin/UnsavedChangesProvider";
import { mapZodIssues } from "@/components/admin/editors/validation";
import { LANDING_FORM_IDS } from "@/config/admin-landing-sections";
import { cn } from "@/lib/utils";
import type {
  DivisionCardContent,
  DivisionCardIconKey,
  ServicesSectionContent,
  WorkTabContent,
} from "@/types/cms";

const ICON_OPTIONS: { key: DivisionCardIconKey; label: string }[] = [
  { key: "smile", label: "Visual & Desain (Smile)" },
  { key: "video", label: "Video & Multimedia (Cam)" },
  { key: "share", label: "Media Sosial (Share)" },
];

export function DivisionsEditor() {
  const { landingContent, updateDivisions, showToast } = useAdminCms();
  const [items, setItems] = useState<DivisionCardContent[]>(
    landingContent.divisions
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(landingContent.divisions),
    [items, landingContent.divisions]
  );
  useDirtyTracker(isDirty, "Section Divisi & Bidang");

  const current = items[activeIdx] ?? items[0];

  const updateItem = (patch: Partial<DivisionCardContent>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === activeIdx ? { ...item, ...patch } : item))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = landingContentSchema.shape.divisions.safeParse(items);
    if (!res.success) {
      setErrors(mapZodIssues(res.error));
      showToast(
        "error",
        "Periksa batas karakter/kalimat pada salah satu kartu divisi."
      );
      return;
    }
    setErrors({});
    updateDivisions(res.data);
  };

  return (
    <form
      id={LANDING_FORM_IDS.divisi}
      onSubmit={handleSave}
      className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-6"
    >
      {/* Pilihan kartu 1-3 */}
      <div className="flex flex-wrap gap-2 pb-5 border-b border-zinc-200/70">
        {items.map((item, idx) => {
          const hasErr = Object.keys(errors).some((k) =>
            k.startsWith(`${idx}.`)
          );
          const isSelected = idx === activeIdx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer border",
                isSelected
                  ? "bg-[#185adb] text-white border-[#185adb]"
                  : hasErr
                  ? "bg-red-50 text-red-600 border-red-300"
                  : "bg-[#f4f5f7] text-zinc-700 border-zinc-200/80 hover:bg-zinc-200/60"
              )}
            >
              0{idx + 1} · {item.collapsedTitle || "Divisi"}
            </button>
          );
        })}
      </div>

      {current && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminTextField
                id={`div-title-${activeIdx}`}
                label="Judul Kartu (Saat Expanded)"
                value={current.title}
                onChange={(v) => updateItem({ title: v })}
                limit={LANDING_CONTENT_LIMITS.divisions.title}
                error={errors[`${activeIdx}.title`]}
                required
              />
              <AdminTextField
                id={`div-collapsed-${activeIdx}`}
                label="Label Kartu (Saat Collapsed)"
                value={current.collapsedTitle}
                onChange={(v) => updateItem({ collapsedTitle: v })}
                limit={LANDING_CONTENT_LIMITS.divisions.collapsedTitle}
                error={errors[`${activeIdx}.collapsedTitle`]}
                required
              />
            </div>

            <AdminTextareaField
              id={`div-desc-${activeIdx}`}
              label="Deskripsi Divisi"
              rows={3}
              value={current.description}
              onChange={(v) => updateItem({ description: v })}
              limit={LANDING_CONTENT_LIMITS.divisions.description}
              error={errors[`${activeIdx}.description`]}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AdminTextField
                id={`div-tag1-${activeIdx}`}
                label="Tag Baris 1"
                value={current.tagRow1}
                onChange={(v) => updateItem({ tagRow1: v })}
                limit={LANDING_CONTENT_LIMITS.divisions.tagRow1}
                error={errors[`${activeIdx}.tagRow1`]}
                required
              />
              <AdminTextField
                id={`div-tag2-${activeIdx}`}
                label="Tag Baris 2"
                value={current.tagRow2}
                onChange={(v) => updateItem({ tagRow2: v })}
                limit={LANDING_CONTENT_LIMITS.divisions.tagRow2}
                error={errors[`${activeIdx}.tagRow2`]}
                required
              />
              <AdminTextField
                id={`div-tagmore-${activeIdx}`}
                label="Tag Tambahan"
                value={current.tagMore}
                onChange={(v) => updateItem({ tagMore: v })}
                limit={LANDING_CONTENT_LIMITS.divisions.tagMore}
                error={errors[`${activeIdx}.tagMore`]}
                required
              />
            </div>

            <div>
              <label
                htmlFor={`div-icon-${activeIdx}`}
                className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
              >
                Preset Ikon Kartu
              </label>
              <div className="relative">
                <select
                  id={`div-icon-${activeIdx}`}
                  value={current.iconKey}
                  onChange={(e) =>
                    updateItem({
                      iconKey: e.target.value as DivisionCardIconKey,
                    })
                  }
                  className="block w-full appearance-none rounded-[12px] border border-zinc-200/80 bg-[#f4f5f7] pl-3.5 pr-11 py-2.5 text-[13.5px] text-[#0c0f1d] focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors cursor-pointer"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:flex lg:flex-col">
            <AdminImageUpload
              id={`div-img-${activeIdx}`}
              label="Gambar Showcase Divisi"
              value={current.image}
              defaultValue={DEFAULT_LANDING_CONTENT.divisions[activeIdx]?.image}
              onChange={(v) => updateItem({ image: v })}
              aspectClass="aspect-[3/2]"
              fillHeight
              error={errors[`${activeIdx}.image`]}
              required
            />
          </div>
        </div>
      )}
    </form>
  );
}

export function ServicesEditor() {
  const { landingContent, updateServices, showToast } = useAdminCms();
  const [form, setForm] = useState<ServicesSectionContent>(
    landingContent.services
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(landingContent.services),
    [form, landingContent.services]
  );
  useDirtyTracker(isDirty, "Section Karya & Portofolio");

  const safeIdx = activeIdx < form.tabs.length ? activeIdx : 0;
  const activeTab = form.tabs[safeIdx] ?? form.tabs[0];

  const updateTab = (patch: Partial<WorkTabContent>) => {
    setForm((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab, idx) =>
        idx === safeIdx ? { ...tab, ...patch } : tab
      ),
    }));
  };

  const handleAddTab = () => {
    if (form.tabs.length >= LANDING_CONTENT_LIMITS.services.tabsCount.max) {
      return;
    }
    const newIndex = form.tabs.length + 1;
    const nextTab: WorkTabContent = {
      id: `karya-baru-${Date.now()}`,
      tabLabel: `Kategori ${newIndex}`,
      headline: "Karya kreatif unggulan pendukung branding fakultas.",
      description:
        "Deskripsi singkat karya kreatif yang dikerjakan oleh tim Creatify untuk publikasi fakultas. Maksimal terdiri atas dua kalimat agar proporsional.",
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
    };
    setForm((prev) => ({ ...prev, tabs: [...prev.tabs, nextTab] }));
    setActiveIdx(form.tabs.length);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = landingContentSchema.shape.services.safeParse(form);
    if (!res.success) {
      setErrors(mapZodIssues(res.error));
      showToast(
        "error",
        "Periksa batas karakter atau jumlah kalimat pada Karya Kami."
      );
      return;
    }
    setErrors({});
    updateServices(res.data);
  };

  return (
    <form
      id={LANDING_FORM_IDS.karya}
      onSubmit={handleSave}
      className="space-y-6"
    >
      {/* Kartu 1: Header Section Karya Kami */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Header Section Karya Kami
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Judul, subjudul 1 kalimat, serta tombol ajakan bergabung.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminTextField
              id="services-title"
              label="Judul Section"
              value={form.title}
              onChange={(v) => setForm((p) => ({ ...p, title: v }))}
              limit={LANDING_CONTENT_LIMITS.services.title}
              error={errors.title}
              required
            />
            <AdminTextField
              id="services-cta"
              label="Teks Tombol CTA"
              value={form.ctaLabel}
              onChange={(v) => setForm((p) => ({ ...p, ctaLabel: v }))}
              limit={LANDING_CONTENT_LIMITS.services.ctaLabel}
              error={errors.ctaLabel}
              required
            />
          </div>

          <AdminTextareaField
            id="services-subtitle"
            label="Subjudul Karya Kami"
            rows={2}
            value={form.subtitle}
            onChange={(v) => setForm((p) => ({ ...p, subtitle: v }))}
            limit={LANDING_CONTENT_LIMITS.services.subtitle}
            error={errors.subtitle}
            required
          />
        </div>
      </div>

      {/* Kartu 2: Editor Tab Showcase */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/70">
          <div>
            <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Daftar Tab Showcase
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              Pilih tab di bawah untuk menyunting konten dan foto showcase.
            </p>
          </div>

          {form.tabs.length < LANDING_CONTENT_LIMITS.services.tabsCount.max && (
            <button
              type="button"
              onClick={handleAddTab}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-4 py-2 text-[13px] font-medium text-[#185adb] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Tab</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {form.tabs.map((tab, idx) => {
            const hasErr = Object.keys(errors).some((k) =>
              k.startsWith(`tabs.${idx}.`)
            );
            const isSelected = idx === safeIdx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer border",
                  isSelected
                    ? "bg-[#185adb] text-white border-[#185adb]"
                    : hasErr
                    ? "bg-red-50 text-red-600 border-red-300"
                    : "bg-[#f4f5f7] text-zinc-700 border-zinc-200/80 hover:bg-zinc-200/60"
                )}
              >
                0{idx + 1} · {tab.tabLabel || "Tab"}
              </button>
            );
          })}
        </div>

        {activeTab && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch pt-2">
            <div className="lg:col-span-7 space-y-4">
              <AdminTextField
                id={`tab-label-${safeIdx}`}
                label="Label Pill Tab"
                value={activeTab.tabLabel}
                onChange={(v) => updateTab({ tabLabel: v })}
                limit={LANDING_CONTENT_LIMITS.services.tabLabel}
                error={errors[`tabs.${safeIdx}.tabLabel`]}
                required
              />

              <AdminTextareaField
                id={`tab-headline-${safeIdx}`}
                label="Headline Showcase Tab"
                rows={2}
                value={activeTab.headline}
                onChange={(v) => updateTab({ headline: v })}
                limit={LANDING_CONTENT_LIMITS.services.tabHeadline}
                error={errors[`tabs.${safeIdx}.headline`]}
                required
              />

              <AdminTextareaField
                id={`tab-desc-${safeIdx}`}
                label="Deskripsi Detail Tab"
                rows={4}
                value={activeTab.description}
                onChange={(v) => updateTab({ description: v })}
                limit={LANDING_CONTENT_LIMITS.services.tabDescription}
                error={errors[`tabs.${safeIdx}.description`]}
                required
              />
            </div>

            <div className="lg:col-span-5 lg:flex lg:flex-col">
              <AdminImageUpload
                id={`tab-img-${safeIdx}`}
                label="Gambar Karya (16:9)"
                value={activeTab.image}
                defaultValue={
                  DEFAULT_LANDING_CONTENT.services.tabs[safeIdx]?.image
                }
                onChange={(v) => updateTab({ image: v })}
                aspectClass="aspect-[16/9]"
                fillHeight
                error={errors[`tabs.${safeIdx}.image`]}
                required
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
