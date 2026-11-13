import { NextRequest, NextResponse } from "next/server";
import { getLandingContent } from "@/lib/cms";
import { verifySessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { landingContentSchema } from "@/config/landing-cms";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const content = await getLandingContent();
    return NextResponse.json({
      success: true,
      data: content.about,
    });
  } catch (error) {
    console.error("GET /api/content/about error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Gagal memuat konten about.",
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
    const parsed = landingContentSchema.shape.about.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format data about tidak valid.",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    await db.siteSetting.upsert({
      where: { key: "about_content" },
      update: { payload: parsed.data as object },
      create: { key: "about_content", payload: parsed.data as object },
    });

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: parsed.data,
      message: "Konten tentang Creatify berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT /api/content/about error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat memperbarui data.",
        },
      },
      { status: 500 }
    );
  }
}
