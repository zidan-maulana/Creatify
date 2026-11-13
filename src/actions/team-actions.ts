"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/auth";
import { deleteMediaAsset } from "@/lib/media";
import { teamPageContentSchema } from "@/config/landing-cms";
import {
  teamMemberSchema,
  teamMemberOrderSchema,
  TeamMemberInput,
  TeamMemberOrderInput,
} from "@/lib/validations/team";
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from "@/types/api";
import type { TeamPageContent } from "@/types/cms";
import type { DivisionId, TeamMember } from "@/data/team";
import { getTeamPageContent } from "@/lib/cms";

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

/**
 * Mengambil data halaman tim (header + daftar anggota)
 */
export async function getTeamPageContentAction(): Promise<
  ApiResponse<{ content: TeamPageContent }>
> {
  try {
    const data = await getTeamPageContent();
    return successResponse({ content: data.content });
  } catch (error) {
    console.error("Gagal memuat data tim:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal mengambil data tim dari database."
    );
  }
}

/**
 * Server Action untuk menyimpan konfigurasi teks header halaman /team
 */
export async function updateTeamHeaderAction(
  header: Pick<TeamPageContent, "titleLine1" | "titleLine2" | "subtitle">
): Promise<ApiResponse<typeof header>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const parsed = teamPageContentSchema.safeParse(header);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Format teks header tim tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    await db.siteSetting.upsert({
      where: { key: "team_header" },
      update: { payload: parsed.data as object },
      create: { key: "team_header", payload: parsed.data as object },
    });

    revalidatePath("/team");
    revalidatePath("/admin/team");

    return successResponse(
      parsed.data,
      "Header halaman Tim berhasil disimpan."
    );
  } catch (error) {
    console.error("Gagal menyimpan header tim:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menyimpan header tim."
    );
  }
}

/**
 * Server Action untuk menambah atau memperbarui anggota tim kepengurusan
 */
export async function upsertTeamMemberAction(
  input: TeamMemberInput
): Promise<ApiResponse<TeamMember>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const parsed = teamMemberSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Data profil anggota tim tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    const data = parsed.data;
    let existingMember = null;

    if (isValidUuid(data.id)) {
      existingMember = await db.teamMember.findUnique({
        where: { id: data.id },
      });
    }

    if (!existingMember && data.name) {
      // Fallback pencocokan nama bila ID berasal dari mock client-side
      existingMember = await db.teamMember.findFirst({
        where: { name: data.name },
      });
    }

    // Jika foto diperbarui dan ada foto lama dengan publicId, bersihkan dari Cloudinary/storage
    if (
      existingMember &&
      existingMember.photoPublicId &&
      data.photoPublicId &&
      existingMember.photoPublicId !== data.photoPublicId
    ) {
      await deleteMediaAsset(existingMember.photoPublicId);
    }

    // Jika avatar diperbarui dan ada avatar lama dengan publicId, bersihkan juga
    if (
      existingMember &&
      existingMember.avatarPublicId &&
      data.avatarPublicId &&
      existingMember.avatarPublicId !== data.avatarPublicId
    ) {
      await deleteMediaAsset(existingMember.avatarPublicId);
    }

    let saved;
    if (existingMember) {
      saved = await db.teamMember.update({
        where: { id: existingMember.id },
        data: {
          name: data.name,
          roleTitle: data.role,
          divisionId: data.divisionId,
          photoUrl: data.photo,
          photoPublicId: data.photoPublicId ?? existingMember.photoPublicId,
          avatarUrl: data.avatar ?? null,
          avatarPublicId: data.avatarPublicId ?? existingMember.avatarPublicId,
          quoteText: data.quoteText ?? null,
          instagramUrl: data.instagramUrl ?? null,
          isLeader: data.isLeader ?? false,
          sortOrder: data.sortOrder ?? existingMember.sortOrder,
        },
      });
    } else {
      // Hitung urutan terakhir
      const count = await db.teamMember.count();
      saved = await db.teamMember.create({
        data: {
          name: data.name,
          roleTitle: data.role,
          divisionId: data.divisionId,
          photoUrl: data.photo,
          photoPublicId: data.photoPublicId ?? null,
          avatarUrl: data.avatar ?? null,
          avatarPublicId: data.avatarPublicId ?? null,
          quoteText: data.quoteText ?? null,
          instagramUrl: data.instagramUrl ?? null,
          isLeader: data.isLeader ?? false,
          sortOrder: data.sortOrder ?? count,
        },
      });
    }

    revalidatePath("/team");
    revalidatePath("/admin/team");
    revalidatePath("/admin");

    const mappedResult: TeamMember = {
      id: saved.id,
      name: saved.name,
      role: saved.roleTitle,
      divisionId: saved.divisionId as DivisionId,
      photo: saved.photoUrl,
      avatar: saved.avatarUrl ?? undefined,
      quoteText: saved.quoteText ?? undefined,
      instagramUrl: saved.instagramUrl ?? undefined,
      isLeader: saved.isLeader,
    };

    return successResponse(
      mappedResult,
      `Profil ${saved.name} berhasil disimpan.`
    );
  } catch (error) {
    console.error("Gagal menyimpan anggota tim:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menyimpan anggota tim."
    );
  }
}

/**
 * Server Action untuk menghapus anggota tim beserta aset gambarnya
 */
export async function deleteTeamMemberAction(
  memberId: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    let member = null;
    if (isValidUuid(memberId)) {
      member = await db.teamMember.findUnique({
        where: { id: memberId },
      });
    }

    if (!member) {
      // Coba cari bila memberId adalah nama slug
      member = await db.teamMember.findFirst({
        where: { name: { contains: memberId.replace(/-/g, " "), mode: "insensitive" } },
      });
    }

    if (!member) {
      return errorResponse("NOT_FOUND", "Data anggota tim tidak ditemukan.");
    }

    // Bersihkan aset media terkait dari storage
    if (member.photoPublicId) {
      await deleteMediaAsset(member.photoPublicId);
    }
    if (member.avatarPublicId) {
      await deleteMediaAsset(member.avatarPublicId);
    }

    await db.teamMember.delete({
      where: { id: member.id },
    });

    revalidatePath("/team");
    revalidatePath("/admin/team");
    revalidatePath("/admin");

    return successResponse(
      { id: member.id },
      `Profil ${member.name} berhasil dihapus permanen.`
    );
  } catch (error) {
    console.error("Gagal menghapus anggota tim:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menghapus anggota tim."
    );
  }
}

/**
 * Server Action untuk memperbarui urutan banyak anggota tim sekaligus
 */
export async function reorderTeamMembersAction(
  input: TeamMemberOrderInput
): Promise<ApiResponse<null>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const parsed = teamMemberOrderSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Format data urutan anggota tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    await db.$transaction(
      parsed.data.orders
        .filter((item) => isValidUuid(item.id))
        .map((item) =>
          db.teamMember.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
    );

    revalidatePath("/team");
    revalidatePath("/admin/team");

    return successResponse(null, "Urutan anggota tim berhasil disimpan.");
  } catch (error) {
    console.error("Gagal mengurutkan anggota tim:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat memperbarui urutan anggota tim."
    );
  }
}

