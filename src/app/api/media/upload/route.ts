import { NextRequest, NextResponse } from "next/server";
import { uploadMediaAction } from "@/actions/media-actions";

/**
 * REST Endpoint: Unggah Berkas Media
 * Sesuai Dokumen 09_API_CONTRACT.md Bagian 4.1
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await uploadMediaAction(formData);

    if (!result.success) {
      const status =
        result.error.code === "UNAUTHORIZED"
          ? 401
          : result.error.code === "VALIDATION_ERROR"
          ? 422
          : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[ApiMediaUpload] Galat endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan sistem saat memproses unggahan.",
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: "/api/media/upload",
        },
      },
      { status: 500 }
    );
  }
}
