import { NextRequest, NextResponse } from "next/server";
import { getLandingContent } from "@/lib/cms";
import { verifySessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const recruitmentUpdateSchema = z.object({
  isOpen: z.boolean(),
  closedNotice: z.string().optional(),
});

export async function GET() {
  try {
    const content = await getLandingContent();
    return NextResponse.json({
      success: true,
      data: {
        isRecruitmentOpen: content.contact.isRecruitmentOpen,
        closedNotice: content.contact.closedNotice,
        submitLabel: content.contact.submitLabel,
        divisionOptions: content.contact.divisionOptions,
      },
    });
  } catch (error) {
    console.error("GET /api/content/recruitment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Gagal memuat status rekrutmen.",
        },
      },
      { status: 500 }
    );
  }
}

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
    const parsed = recruitmentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format status rekrutmen tidak valid.",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const content = await getLandingContent();
    const nextContact = {
      ...content.contact,
      isRecruitmentOpen: parsed.data.isOpen,
      ...(parsed.data.closedNotice
        ? { closedNotice: parsed.data.closedNotice }
        : {}),
    };

    await db.siteSetting.upsert({
      where: { key: "contact" },
      update: { payload: nextContact as object },
      create: { key: "contact", payload: nextContact as object },
    });

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: {
        isRecruitmentOpen: nextContact.isRecruitmentOpen,
        closedNotice: nextContact.closedNotice,
      },
      message: "Status rekrutmen berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT /api/content/recruitment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat memperbarui status rekrutmen.",
        },
      },
      { status: 500 }
    );
  }
}

