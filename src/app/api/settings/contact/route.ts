import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/cms";
import { verifySessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSettingsSchema } from "@/config/landing-cms";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET /api/settings/contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Gagal memuat pengaturan situs dan kontak.",
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
    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format data kontak & pengaturan situs tidak valid.",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    await db.siteSetting.upsert({
      where: { key: "site_settings" },
      update: { payload: parsed.data as object },
      create: { key: "site_settings", payload: parsed.data as object },
    });

    revalidatePath("/");
    revalidatePath("/team");

    return NextResponse.json({
      success: true,
      data: parsed.data,
      message: "Pengaturan situs & kanal kontak berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT /api/settings/contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat menyimpan pengaturan kontak.",
        },
      },
      { status: 500 }
    );
  }
}

