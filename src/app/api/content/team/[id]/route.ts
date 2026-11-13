import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/auth";
import { deleteMediaAsset } from "@/lib/media";
import { teamMemberSchema } from "@/lib/validations/team";
import { revalidatePath } from "next/cache";

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Sesi admin tidak valid atau telah berakhir.",
          },
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!isValidUuid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format ID anggota tim tidak valid.",
          },
        },
        { status: 422 }
      );
    }

    const body = await req.json();
    const parsed = teamMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Data profil anggota tim tidak valid.",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const existing = await db.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Anggota tim tidak ditemukan.",
          },
        },
        { status: 404 }
      );
    }

    // Pembersihan aset lama bila diubah
    if (
      existing.photoPublicId &&
      parsed.data.photoPublicId &&
      existing.photoPublicId !== parsed.data.photoPublicId
    ) {
      await deleteMediaAsset(existing.photoPublicId);
    }
    if (
      existing.avatarPublicId &&
      parsed.data.avatarPublicId &&
      existing.avatarPublicId !== parsed.data.avatarPublicId
    ) {
      await deleteMediaAsset(existing.avatarPublicId);
    }

    const updated = await db.teamMember.update({
      where: { id },
      data: {
        name: parsed.data.name,
        roleTitle: parsed.data.role,
        divisionId: parsed.data.divisionId,
        photoUrl: parsed.data.photo,
        photoPublicId: parsed.data.photoPublicId ?? existing.photoPublicId,
        avatarUrl: parsed.data.avatar ?? null,
        avatarPublicId: parsed.data.avatarPublicId ?? existing.avatarPublicId,
        quoteText: parsed.data.quoteText ?? null,
        instagramUrl: parsed.data.instagramUrl ?? null,
        isLeader: parsed.data.isLeader ?? false,
        sortOrder: parsed.data.sortOrder ?? existing.sortOrder,
      },
    });

    revalidatePath("/team");

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Profil ${updated.name} berhasil diperbarui.`,
    });
  } catch (error) {
    console.error("PUT /api/content/team/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat memperbarui anggota tim.",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Sesi admin tidak valid atau telah berakhir.",
          },
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!isValidUuid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format ID anggota tidak valid.",
          },
        },
        { status: 422 }
      );
    }

    const member = await db.teamMember.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Anggota tim tidak ditemukan.",
          },
        },
        { status: 404 }
      );
    }

    if (member.photoPublicId) {
      await deleteMediaAsset(member.photoPublicId);
    }
    if (member.avatarPublicId) {
      await deleteMediaAsset(member.avatarPublicId);
    }

    await db.teamMember.delete({ where: { id } });

    revalidatePath("/team");

    return NextResponse.json({
      success: true,
      message: `Profil ${member.name} berhasil dihapus permanen.`,
    });
  } catch (error) {
    console.error("DELETE /api/content/team/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat menghapus anggota tim.",
        },
      },
      { status: 500 }
    );
  }
}

