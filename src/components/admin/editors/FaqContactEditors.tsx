"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import {
  LANDING_CONTENT_LIMITS,
  landingContentSchema,
} from "@/config/landing-cms";
import {
  AdminSwitch,
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/AdminField";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";
import { useDirtyTracker } from "@/components/admin/UnsavedChangesProvider";
import { mapZodIssues } from "@/components/admin/editors/validation";
import { LANDING_FORM_IDS } from "@/config/admin-landing-sections";
import { cn } from "@/lib/utils";
import type {
  ContactSectionContent,
  FaqItemContent,
  FaqSectionContent,
  RecruitmentDivisionOption,
} from "@/types/cms";

export function FaqEditor() {
  const { landingContent, updateFaq, showToast } = useAdminCms();
  const [form, setForm] = useState<FaqSectionContent>(landingContent.faq);
  const [openIdx, setOpenIdx] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(landingContent.faq),
    [form, landingContent.faq]
  );
  useDirtyTracker(isDirty, "Section FAQ");

  const updateItem = (idx: number, patch: Partial<FaqItemContent>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === idx ? { ...item, ...patch } : item
      ),
    }));
  };

  const handleAddFaq = () => {
    if (form.items.length >= LANDING_CONTENT_LIMITS.faq.itemsCount.max) return;
    const nextLength = form.items.length;
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `faq-${Date.now()}`,
          question: "Pertanyaan baru seputar aktivitas Creatify?",
          answer:
            "Jawaban ringkas mengenai pertanyaan tersebut. Gunakan maksimal dua kalimat agar accordion tetap bersih.",
        },
      ],
    }));
    setOpenIdx(nextLength);
  };

  const handleRemoveFaq = (idxToRemove: number) => {
    if (form.items.length <= LANDING_CONTENT_LIMITS.faq.itemsCount.min) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== idxToRemove),
    }));
    setOpenIdx(0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = landingContentSchema.shape.faq.safeParse(form);
    if (!res.success) {
      const fieldErrors = mapZodIssues(res.error);
      setErrors(fieldErrors);
      const firstErrKey = Object.keys(fieldErrors).find((k) =>
        k.startsWith("items.")
      );
      if (firstErrKey) {
        const idx = Number(firstErrKey.split(".")[1]);
        if (!Number.isNaN(idx)) setOpenIdx(idx);
      }
      showToast(
        "error",
        "Periksa kembali batas karakter/kalimat pada section FAQ."
      );
      return;
    }
    setErrors({});
    updateFaq(res.data);
  };

  return (
    <form id={LANDING_FORM_IDS.faq} onSubmit={handleSave} className="space-y-6">
      {/* Card 1: Kolom Kiri FAQ */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Kolom Kiri FAQ
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Judul sticky &amp; subjudul pengantar email.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminTextField
            id="faq-title-1"
            label="Judul FAQ — Baris 1"
            value={form.titleLine1}
            onChange={(v) => setForm((p) => ({ ...p, titleLine1: v }))}
            limit={LANDING_CONTENT_LIMITS.faq.titleLine1}
            error={errors.titleLine1}
            required
          />
          <AdminTextField
            id="faq-title-2"
            label="Judul FAQ — Baris 2"
            value={form.titleLine2}
            onChange={(v) => setForm((p) => ({ ...p, titleLine2: v }))}
            limit={LANDING_CONTENT_LIMITS.faq.titleLine2}
            error={errors.titleLine2}
            required
          />
        </div>

        <AdminTextareaField
          id="faq-subtitle"
          label="Subjudul Kolom Kiri"
          rows={2}
          value={form.subtitle}
          onChange={(v) => setForm((p) => ({ ...p, subtitle: v }))}
          limit={LANDING_CONTENT_LIMITS.faq.subtitle}
          error={errors.subtitle}
          required
        />

        <AdminTextField
          id="faq-cta"
          label="Teks Tombol Email"
          value={form.ctaLabel}
          onChange={(v) => setForm((p) => ({ ...p, ctaLabel: v }))}
          limit={LANDING_CONTENT_LIMITS.faq.ctaLabel}
          error={errors.ctaLabel}
          required
        />
      </div>

      {/* Card 2: Daftar Accordion Pertanyaan FAQ */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/70">
          <div>
            <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Daftar Accordion ({form.items.length}/
              {LANDING_CONTENT_LIMITS.faq.itemsCount.max})
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              Klik salah satu pertanyaan untuk menyunting isi jawaban.
            </p>
          </div>

          {form.items.length < LANDING_CONTENT_LIMITS.faq.itemsCount.max && (
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-3.5 py-2 text-[12.5px] font-medium text-[#185adb] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah FAQ</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {form.items.map((item, idx) => {
            const isOpen = openIdx === idx;
            const hasErr = Boolean(
              errors[`items.${idx}.question`] || errors[`items.${idx}.answer`]
            );

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-[18px] border transition-colors",
                  hasErr
                    ? "border-red-300 bg-red-50/30"
                    : isOpen
                    ? "border-[#185adb]/30 bg-[#f4f5f7]/70"
                    : "border-zinc-200/80 bg-[#f4f5f7]/45"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-zinc-200/80 text-[11px] font-semibold text-[#185adb] shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="text-[14px] font-medium text-[#0c0f1d] truncate">
                      {item.question || "Pertanyaan kosong"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-zinc-500 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-[#185adb]"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 space-y-4 border-t border-zinc-200/60">
                    <AdminTextField
                      id={`faq-q-${idx}`}
                      label="Pertanyaan"
                      value={item.question}
                      onChange={(v) => updateItem(idx, { question: v })}
                      limit={LANDING_CONTENT_LIMITS.faq.question}
                      error={errors[`items.${idx}.question`]}
                      required
                    />

                    <AdminTextareaField
                      id={`faq-a-${idx}`}
                      label="Jawaban"
                      rows={3}
                      value={item.answer}
                      onChange={(v) => updateItem(idx, { answer: v })}
                      limit={LANDING_CONTENT_LIMITS.faq.answer}
                      error={errors[`items.${idx}.answer`]}
                      required
                    />

                    {form.items.length >
                      LANDING_CONTENT_LIMITS.faq.itemsCount.min && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus Pertanyaan Ini</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
}

export function ContactFooterEditor() {
  const { landingContent, updateContact, showToast } = useAdminCms();
  const [form, setForm] = useState<ContactSectionContent>(
    landingContent.contact
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(landingContent.contact),
    [form, landingContent.contact]
  );
  useDirtyTracker(isDirty, "Section Rekrutmen & Kontak");

  const updateDivisionOption = (
    idx: number,
    patch: Partial<RecruitmentDivisionOption>
  ) => {
    setForm((prev) => ({
      ...prev,
      divisionOptions: prev.divisionOptions.map((opt, i) =>
        i === idx ? { ...opt, ...patch } : opt
      ),
    }));
  };

  const handleAddOption = () => {
    if (
      form.divisionOptions.length >=
      LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.max
    ) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      divisionOptions: [
        ...prev.divisionOptions,
        {
          id: `divisi-opsi-${Date.now()}`,
          label: "Divisi Baru",
          description: "Fokus karya dan bidang tugas divisi",
        },
      ],
    }));
  };

  const handleRemoveOption = (idxToRemove: number) => {
    if (
      form.divisionOptions.length <=
      LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.min
    ) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      divisionOptions: prev.divisionOptions.filter((_, i) => i !== idxToRemove),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = landingContentSchema.shape.contact.safeParse(form);
    if (!res.success) {
      setErrors(mapZodIssues(res.error));
      showToast(
        "error",
        "Periksa kembali batas karakter/kalimat pada Rekrutmen & Footer."
      );
      return;
    }
    setErrors({});
    updateContact(res.data);
  };

  return (
    <form
      id={LANDING_FORM_IDS.rekrutmen}
      onSubmit={handleSave}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
        {/* Kolom Kiri: Pengantar & Status Rekrutmen */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-5">
          <div className="pb-4 border-b border-zinc-200/70">
            <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Status &amp; Pengantar
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              Kolom kiri section rekrutmen.
            </p>
          </div>

          <AdminSwitch
            checked={form.isRecruitmentOpen}
            onChange={(checked) =>
              setForm((p) => ({ ...p, isRecruitmentOpen: checked }))
            }
            label="Status Open Recruitment"
            description={
              form.isRecruitmentOpen
                ? "Formulir pendaftaran aktif ditampilkan."
                : "Formulir terkunci & memunculkan pesan penutupan saat di-hover."
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <AdminTextField
              id="contact-title-1"
              label="Judul Rekrutmen — Baris 1"
              value={form.titleLine1}
              onChange={(v) => setForm((p) => ({ ...p, titleLine1: v }))}
              limit={LANDING_CONTENT_LIMITS.contact.titleLine1}
              error={errors.titleLine1}
              required
            />
            <AdminTextField
              id="contact-title-2"
              label="Judul Rekrutmen — Baris 2"
              value={form.titleLine2}
              onChange={(v) => setForm((p) => ({ ...p, titleLine2: v }))}
              limit={LANDING_CONTENT_LIMITS.contact.titleLine2}
              error={errors.titleLine2}
              required
            />
          </div>

          <AdminTextareaField
            id="contact-subtitle"
            label="Subjudul Kolom Kiri"
            rows={2}
            value={form.subtitle}
            onChange={(v) => setForm((p) => ({ ...p, subtitle: v }))}
            limit={LANDING_CONTENT_LIMITS.contact.subtitle}
            error={errors.subtitle}
            required
          />

          <AdminTextareaField
            id="contact-closed-notice"
            label="Pesan Saat Rekrutmen Ditutup"
            rows={2}
            value={form.closedNotice}
            onChange={(v) => setForm((p) => ({ ...p, closedNotice: v }))}
            limit={LANDING_CONTENT_LIMITS.contact.closedNotice}
            error={errors.closedNotice}
            required
          />
        </div>

        {/* Kolom Kanan: Opsi Dropdown Form Rekrutmen */}
        <div className="lg:col-span-7 h-full rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/70">
            <div>
              <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
                Pilihan Divisi &amp; Tombol Form ({form.divisionOptions.length}/
                {LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.max})
              </h2>
              <p className="mt-1 text-[13px] text-zinc-500">
                Isi dropdown Divisi Pilihan dan label tombol kirim.
              </p>
            </div>

            {form.divisionOptions.length <
              LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.max && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-3.5 py-2 text-[12.5px] font-medium text-[#185adb] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Divisi</span>
              </button>
            )}
          </div>

          <AdminTextField
            id="contact-submit-label"
            label="Label Tombol Submit Form"
            value={form.submitLabel}
            onChange={(v) => setForm((p) => ({ ...p, submitLabel: v }))}
            limit={LANDING_CONTENT_LIMITS.contact.submitLabel}
            error={errors.submitLabel}
            required
          />

          <div className="space-y-3">
            {form.divisionOptions.map((opt, idx) => (
              <div
                key={opt.id}
                className="rounded-[18px] border border-zinc-200/80 bg-[#f4f5f7]/60 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#185adb]">
                    Opsi #{idx + 1}
                  </span>
                  {form.divisionOptions.length >
                    LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.min && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AdminTextField
                    id={`div-opt-label-${idx}`}
                    label="Nama Divisi"
                    value={opt.label}
                    onChange={(v) => updateDivisionOption(idx, { label: v })}
                    limit={LANDING_CONTENT_LIMITS.contact.divisionLabel}
                    error={errors[`divisionOptions.${idx}.label`]}
                    required
                  />

                  <AdminTextField
                    id={`div-opt-desc-${idx}`}
                    label="Deskripsi Singkat"
                    value={opt.description}
                    onChange={(v) =>
                      updateDivisionOption(idx, { description: v })
                    }
                    limit={LANDING_CONTENT_LIMITS.contact.divisionDescription}
                    error={errors[`divisionOptions.${idx}.description`]}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kartu Bawah: Footer Bawah & Simpan */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-7 space-y-5">
        <div className="pb-4 border-b border-zinc-200/70">
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Informasi Footer Bawah
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            Deskripsi brand singkat di kolom kiri footer dan baris hak cipta.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminTextField
              id="footer-copyright"
              label="Teks Hak Cipta"
              value={form.copyrightText}
              onChange={(v) => setForm((p) => ({ ...p, copyrightText: v }))}
              limit={LANDING_CONTENT_LIMITS.contact.copyrightText}
              error={errors.copyrightText}
              required
            />
            <AdminTextField
              id="footer-faculty"
              label="Label Fakultas Bawah"
              value={form.facultyLabel}
              onChange={(v) => setForm((p) => ({ ...p, facultyLabel: v }))}
              limit={LANDING_CONTENT_LIMITS.contact.facultyLabel}
              error={errors.facultyLabel}
              required
            />
          </div>

          <AdminTextareaField
            id="footer-desc"
            label="Deskripsi Brand Footer"
            rows={2}
            value={form.footerDescription}
            onChange={(v) =>
              setForm((p) => ({ ...p, footerDescription: v }))
            }
            limit={LANDING_CONTENT_LIMITS.contact.footerDescription}
            error={errors.footerDescription}
            required
          />
        </div>
      </div>
    </form>
  );
}
