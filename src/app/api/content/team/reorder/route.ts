import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/auth";
import { teamMemberOrderSchema } from "@/lib/validations/team";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest) {
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
    const parsed = teamMemberOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format data urutan anggota tidak valid.",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    await db.$transaction(
      parsed.data.orders.map((item) =>
        db.teamMember.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    revalidatePath("/team");

    return NextResponse.json({
      success: true,
      message: "Urutan anggota tim berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT /api/content/team/reorder error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat memperbarui urutan tim.",
        },
      },
      { status: 500 }
    );
  }
}

