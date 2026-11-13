import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/auth";
import { teamMemberSchema } from "@/lib/validations/team";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const members = await db.teamMember.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: members.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.roleTitle,
        divisionId: m.divisionId,
        photoUrl: m.photoUrl,
        photoPublicId: m.photoPublicId,
        avatarUrl: m.avatarUrl,
        avatarPublicId: m.avatarPublicId,
        quoteText: m.quoteText,
        instagramUrl: m.instagramUrl,
        isLeader: m.isLeader,
        sortOrder: m.sortOrder,
      })),
    });
  } catch (error) {
    console.error("GET /api/content/team error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Gagal memuat daftar anggota tim.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const parsed = teamMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Data anggota tidak valid.",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const count = await db.teamMember.count();
    const created = await db.teamMember.create({
      data: {
        name: parsed.data.name,
        roleTitle: parsed.data.role,
        divisionId: parsed.data.divisionId,
        photoUrl: parsed.data.photo,
        photoPublicId: parsed.data.photoPublicId ?? null,
        avatarUrl: parsed.data.avatar ?? null,
        avatarPublicId: parsed.data.avatarPublicId ?? null,
        quoteText: parsed.data.quoteText ?? null,
        instagramUrl: parsed.data.instagramUrl ?? null,
        isLeader: parsed.data.isLeader ?? false,
        sortOrder: parsed.data.sortOrder ?? count,
      },
    });

    revalidatePath("/team");

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: "Anggota tim berhasil ditambahkan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/content/team error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan saat menambahkan anggota tim.",
        },
      },
      { status: 500 }
    );
  }
}

