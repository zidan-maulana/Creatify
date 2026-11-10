"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, ChevronDown, Check } from "lucide-react";
import {
  DIVISION_OPTIONS,
  DivisionId,
  TeamMember,
} from "@/data/team";
import {
  LANDING_CONTENT_LIMITS,
  teamPageContentSchema,
} from "@/config/landing-cms";
import {
  AdminConfirmModal,
  AdminSectionHeader,
  AdminSwitch,
  AdminTextField,
  AdminTextareaField,
} from "@/components/admin/AdminField";
import { AdminImageUpload } from "@/components/admin/AdminImageUpload";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";
import { mapZodIssues } from "@/components/admin/editors/validation";
import { cn } from "@/lib/utils";

type DivisionFilter = "all" | DivisionId;

const EMPTY_MEMBER: TeamMember = {
  id: "",
  name: "",
  role: "",
  divisionId: "visual-creative",
  photo: "",
  avatar: "",
  quoteText: "",
  instagramUrl: "",
  isLeader: false,
};

export default function AdminTeamPage() {
  const {
    teamContent,
    isHydrated,
    updateTeamHeader,
    upsertTeamMember,
    deleteTeamMember,
    showToast,
  } = useAdminCms();

  const [selectedDivision, setSelectedDivision] =
    useState<DivisionFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilterOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFilterOpen]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return teamContent.members.filter((member) => {
      const matchesDivision =
        selectedDivision === "all"
          ? true
          : selectedDivision === "executive-committee"
          ? Boolean(member.isLeader)
          : member.divisionId === selectedDivision;
      const matchesQuery =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);
      return matchesDivision && matchesQuery;
    });
  }, [teamContent.members, selectedDivision, searchQuery]);

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (
      !editingMember.name.trim() ||
      !editingMember.role.trim() ||
      !editingMember.photo.trim()
    ) {
      showToast("error", "Nama, peran, dan foto anggota wajib diisi.");
      return;
    }

    const normalized: TeamMember = {
      ...editingMember,
      id:
        editingMember.id ||
        `${editingMember.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: editingMember.name.trim(),
      role: editingMember.role.trim(),
      photo: editingMember.photo.trim(),
      avatar: editingMember.avatar?.trim() || undefined,
      quoteText: editingMember.quoteText?.trim() || undefined,
      instagramUrl: editingMember.instagramUrl?.trim() || undefined,
    };

    upsertTeamMember(normalized);
    setEditingMember(null);
  };

  const divisionFilterChoices: { id: DivisionFilter; label: string; count: number }[] =
    useMemo(
      () => [
        { id: "all", label: "Semua Divisi", count: teamContent.members.length },
        ...DIVISION_OPTIONS.map((opt) => ({
          id: opt.id,
          label: opt.badge,
          count:
            opt.id === "executive-committee"
              ? teamContent.members.filter((m) => m.isLeader).length
              : teamContent.members.filter((m) => m.divisionId === opt.id).length,
        })),
      ],
      [teamContent.members]
    );

  const activeFilterOption =
    divisionFilterChoices.find((opt) => opt.id === selectedDivision) ??
    divisionFilterChoices[0];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Tim & Pengurus Creatify"
        description="Kelola profil pimpinan, anggota per divisi, dan teks header halaman /team."
        actions={
          <>
            <button
              type="button"
              onClick={() => setIsHeaderOpen((prev) => !prev)}
              className="rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-4 py-2.5 text-[13.5px] font-medium text-[#0c0f1d] transition-colors cursor-pointer"
            >
              {isHeaderOpen ? "Tutup Header /team" : "Sunting Header /team"}
            </button>
            <button
              type="button"
              onClick={() => setEditingMember({ ...EMPTY_MEMBER })}
              className="inline-flex items-center gap-2 rounded-full bg-[#185adb] hover:bg-[#1348b5] px-5 py-2.5 text-[14px] font-medium text-white transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Anggota</span>
            </button>
          </>
        }
      />

      {/* Editor Header Halaman /team (collapsible agar grid tim langsung terlihat) */}
      {isHeaderOpen && (
        <TeamHeaderForm
          key={`${isHydrated}-${teamContent.titleLine1}-${teamContent.titleLine2}-${teamContent.subtitle}`}
          initialHeader={{
            titleLine1: teamContent.titleLine1,
            titleLine2: teamContent.titleLine2,
            subtitle: teamContent.subtitle,
          }}
          onSave={updateTeamHeader}
          onValidationError={() =>
            showToast(
              "error",
              "Periksa batas karakter/kalimat pada header halaman Tim."
            )
          }
        />
      )}

      {/* Toolbar Search Bar kiri memanjang + Dropdown Divisi di kanan */}
      <div className="rounded-[22px] sm:rounded-[24px] border border-zinc-200/80 bg-white p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau peran..."
            className="w-full rounded-[12px] border border-zinc-200/80 bg-[#f4f5f7] pl-10 pr-4 py-2 text-[13.5px] text-[#0c0f1d] placeholder:text-zinc-400 focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Dropdown Divisi */}
        <div
          ref={filterDropdownRef}
          className="relative w-full sm:w-[240px] shrink-0"
        >
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={cn(
              "w-full flex items-center justify-between gap-2.5 rounded-[12px] border px-4 py-2 text-[13.5px] font-medium transition-colors cursor-pointer select-none",
              isFilterOpen
                ? "border-[#185adb] bg-white text-[#0c0f1d]"
                : "border-zinc-200/80 bg-[#f4f5f7] hover:bg-zinc-200/60 text-[#0c0f1d]"
            )}
          >
            <span className="truncate">
              {activeFilterOption.label} ({activeFilterOption.count})
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-zinc-500 shrink-0 transition-transform duration-200",
                isFilterOpen && "rotate-180 text-[#185adb]"
              )}
            />
          </button>

          {isFilterOpen && (
            <div
              role="listbox"
              aria-label="Filter divisi tim"
              className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-[16px] border border-zinc-200 bg-white p-1.5 shadow-[0_10px_28px_rgba(12,15,29,0.08)]"
            >
              {divisionFilterChoices.map((option) => {
                const isSelected = selectedDivision === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedDivision(option.id);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#185adb]/[0.07] font-semibold text-[#185adb]"
                        : "font-medium text-[#0c0f1d] hover:bg-zinc-50"
                    )}
                  >
                    <span className="truncate">
                      {option.label}{" "}
                      <span className="text-zinc-400 font-normal">
                        ({option.count})
                      </span>
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[#185adb] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid Anggota (Komposisi ringkas: foto, nama & peran) */}
      {filteredMembers.length === 0 ? (
        <div className="rounded-[24px] border border-zinc-200/80 bg-white p-10 text-center">
          <p className="text-[15px] font-medium text-[#0c0f1d]">
            Tidak ada anggota yang cocok dengan filter saat ini.
          </p>
          <p className="mt-1 text-[13.5px] text-zinc-500">
            Ubah pilihan divisi atau kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="h-full rounded-[24px] border border-zinc-200/80 bg-white p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-14 w-14 rounded-[14px] object-cover object-top border border-zinc-200/80 shrink-0 bg-zinc-100"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#0c0f1d] truncate leading-[1.25]">
                    {member.name}
                  </h3>
                  <p className="text-[14px] text-zinc-500 truncate mt-1 leading-[1.35]">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-zinc-100 flex items-center gap-2.5">
                {member.instagramUrl && (
                  <a
                    href={member.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${member.name}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200/90 text-zinc-600 hover:text-[#e1306c] hover:border-[#e1306c]/40 transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                )}

                <div className="flex-1 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingMember({ ...member })}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-4 py-2 text-[13px] font-medium text-[#0c0f1d] transition-colors cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#185adb]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberToDelete(member)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 bg-white hover:bg-red-50 px-4 py-2 text-[13px] font-medium text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Anggota */}
      {editingMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0f1d]/40 backdrop-blur-[2px] p-4 sm:p-6"
          onClick={() => setEditingMember(null)}
        >
          <form
            onSubmit={handleSaveMember}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white"
          >
            {/* Header Modal (Pinned) */}
            <div className="shrink-0 flex items-center justify-between gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-zinc-200/70">
              <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
                {editingMember.id ? "Edit Profil Anggota" : "Tambah Anggota Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                aria-label="Tutup modal anggota"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Area Konten Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scrollbar px-6 sm:px-8 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-[174px_1fr] gap-5 items-stretch">
                <div>
                  <AdminImageUpload
                    id="member-photo"
                    label="Foto Potret (3:4)"
                    value={editingMember.photo}
                    onChange={(v) =>
                      setEditingMember((p) => (p ? { ...p, photo: v } : null))
                    }
                    aspectClass="aspect-[3/4]"
                    compactActions
                    maxSizeMb={3}
                    helperText="JPG, PNG, WEBP · Maks 3 MB"
                    required
                  />
                </div>

                <div className="space-y-3.5">
                  <AdminTextField
                    id="member-name"
                    label="Nama Lengkap"
                    value={editingMember.name}
                    onChange={(v) =>
                      setEditingMember((p) => (p ? { ...p, name: v } : null))
                    }
                    required
                  />

                  <AdminTextField
                    id="member-role"
                    label="Jabatan / Peran"
                    value={editingMember.role}
                    onChange={(v) =>
                      setEditingMember((p) => (p ? { ...p, role: v } : null))
                    }
                    placeholder="mis. Lead Graphic Designer"
                    required
                  />

                  <div>
                    <label
                      htmlFor="member-division"
                      className="block text-[12.5px] font-medium text-[#0c0f1d] mb-1.5"
                    >
                      Divisi
                    </label>
                    <div className="relative">
                      <select
                        id="member-division"
                        value={editingMember.divisionId}
                        onChange={(e) =>
                          setEditingMember((p) =>
                            p
                              ? {
                                  ...p,
                                  divisionId: e.target.value as DivisionId,
                                }
                              : null
                          )
                        }
                        className="block w-full appearance-none rounded-[12px] border border-zinc-200/80 bg-[#f4f5f7] pl-3.5 pr-10 py-2.5 text-[13.5px] text-[#0c0f1d] focus:border-[#185adb] focus:bg-white focus:outline-none transition-colors cursor-pointer"
                      >
                        {DIVISION_OPTIONS.filter(
                          (d) => d.id !== "executive-committee"
                        ).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.badge}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>

                  <AdminTextField
                    id="member-ig"
                    label="URL Instagram (Opsional)"
                    value={editingMember.instagramUrl ?? ""}
                    onChange={(v) =>
                      setEditingMember((p) =>
                        p ? { ...p, instagramUrl: v } : null
                      )
                    }
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>

              <AdminSwitch
                checked={Boolean(editingMember.isLeader)}
                onChange={(checked) =>
                  setEditingMember((p) =>
                    p ? { ...p, isLeader: checked } : null
                  )
                }
                label="Pengurus Inti (Executive)"
                description="Tampil pada filter tab Executive Committee di /team."
              />

              <AdminTextareaField
                id="member-quote"
                label="Kutipan Pimpinan (Khusus Ketua & Wakil)"
                rows={2}
                value={editingMember.quoteText ?? ""}
                onChange={(v) =>
                  setEditingMember((p) => (p ? { ...p, quoteText: v } : null))
                }
                placeholder="Opsional, tampil pada kartu kutipan Ketua/Wakil..."
              />
            </div>

            {/* Footer Aksi Modal (Pinned) */}
            <div className="shrink-0 flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-zinc-200/70 bg-white">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-5 py-2.5 text-[13.5px] font-medium text-[#0c0f1d] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#185adb] hover:bg-[#1348b5] px-6 py-2.5 text-[13.5px] font-medium text-white cursor-pointer"
              >
                Simpan Anggota
              </button>
            </div>
          </form>
        </div>
      )}

      <AdminConfirmModal
        open={Boolean(memberToDelete)}
        title="Hapus Anggota Tim?"
        description={
          memberToDelete
            ? `Profil "${memberToDelete.name}" akan dihapus dari daftar tim Creatify. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Ya, Hapus Anggota"
        onCancel={() => setMemberToDelete(null)}
        onConfirm={() => {
          if (memberToDelete) {
            deleteTeamMember(memberToDelete.id);
            setMemberToDelete(null);
          }
        }}
      />
    </div>
  );
}


interface TeamHeaderValue {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
}

function TeamHeaderForm({
  initialHeader,
  onSave,
  onValidationError,
}: {
  initialHeader: TeamHeaderValue;
  onSave: (header: TeamHeaderValue) => void;
  onValidationError: () => void;
}) {
  const [headerForm, setHeaderForm] = useState<TeamHeaderValue>(initialHeader);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    const res = teamPageContentSchema.safeParse(headerForm);
    if (!res.success) {
      setHeaderErrors(mapZodIssues(res.error));
      onValidationError();
      return;
    }
    setHeaderErrors({});
    onSave(res.data);
  };

  return (
    <form
      onSubmit={handleSaveHeader}
      className="rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-zinc-200/70">
        <div>
          <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
            Header Halaman Tim (/team)
          </h2>
          <p className="mt-0.5 text-[13px] text-zinc-500">
            Mengatur judul 2 baris dan subjudul pengantar halaman daftar tim.
          </p>
        </div>
        <button
          type="submit"
          className="rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-5 py-2 text-[13px] font-medium text-[#0c0f1d] transition-colors cursor-pointer self-start sm:self-auto"
        >
          Simpan Header Tim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <AdminTextField
          id="team-title-1"
          label="Judul Baris 1"
          value={headerForm.titleLine1}
          onChange={(v) => setHeaderForm((p) => ({ ...p, titleLine1: v }))}
          limit={LANDING_CONTENT_LIMITS.teamPage.titleLine1}
          error={headerErrors.titleLine1}
          required
        />
        <AdminTextField
          id="team-title-2"
          label="Judul Baris 2"
          value={headerForm.titleLine2}
          onChange={(v) => setHeaderForm((p) => ({ ...p, titleLine2: v }))}
          limit={LANDING_CONTENT_LIMITS.teamPage.titleLine2}
          error={headerErrors.titleLine2}
          required
        />
      </div>

      <AdminTextareaField
        id="team-subtitle"
        label="Subjudul Halaman Tim"
        rows={2}
        value={headerForm.subtitle}
        onChange={(v) => setHeaderForm((p) => ({ ...p, subtitle: v }))}
        limit={LANDING_CONTENT_LIMITS.teamPage.subtitle}
        error={headerErrors.subtitle}
        required
      />
    </form>
  );
}
