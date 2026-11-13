import { NextRequest, NextResponse } from "next/server";
import { deleteCategoryAction } from "@/actions/portfolio-actions";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let replacementCategoryId: string | undefined = undefined;

    // Baca replacementCategoryId jika ada body JSON
    try {
      const text = await req.text();
      if (text) {
        const body = JSON.parse(text);
        replacementCategoryId = body.replacementCategoryId;
      }
    } catch {
      // Body kosong diperbolehkan jika kategori tidak memiliki karya
    }

    const result = await deleteCategoryAction(id, replacementCategoryId);
    if (!result.success) {
      const status =
        result.error.code === "UNAUTHORIZED"
          ? 401
          : result.error.code === "CATEGORY_RESTRICTED"
          ? 400
          : result.error.code === "VALIDATION_ERROR"
          ? 422
          : result.error.code === "NOT_FOUND"
          ? 404
          : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat menghapus kategori.",
        },
      },
      { status: 500 }
    );
  }
}
