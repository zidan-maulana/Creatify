import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioItemBySlugAction,
  updatePortfolioItemAction,
  deletePortfolioItemAction,
} from "@/actions/portfolio-actions";
import { db } from "@/lib/db";

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  let result = await getPortfolioItemBySlugAction(slug);

  // Jika tidak ditemukan berdasarkan slug dan formatnya UUID, coba cari via id
  if (!result.success && isValidUuid(slug)) {
    const item = await db.portfolioItem.findUnique({
      where: { id: slug },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    if (item) {
      result = await getPortfolioItemBySlugAction(item.slug);
    }
  }

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: idOrSlug } = await params;
    const body = await req.json();

    let targetId = idOrSlug;
    if (!isValidUuid(idOrSlug)) {
      const found = await db.portfolioItem.findUnique({
        where: { slug: idOrSlug },
        select: { id: true },
      });
      if (found) targetId = found.id;
    }

    const result = await updatePortfolioItemAction(targetId, body);
    if (!result.success) {
      const status =
        result.error.code === "UNAUTHORIZED"
          ? 401
          : result.error.code === "NOT_FOUND"
          ? 404
          : result.error.code === "VALIDATION_ERROR"
          ? 422
          : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/portfolio/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat memperbarui karya.",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: idOrSlug } = await params;
    let targetId = idOrSlug;
    if (!isValidUuid(idOrSlug)) {
      const found = await db.portfolioItem.findUnique({
        where: { slug: idOrSlug },
        select: { id: true },
      });
      if (found) targetId = found.id;
    }

    const result = await deletePortfolioItemAction(targetId);
    if (!result.success) {
      const status =
        result.error.code === "UNAUTHORIZED"
          ? 401
          : result.error.code === "NOT_FOUND"
          ? 404
          : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE /api/portfolio/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server saat menghapus karya.",
        },
      },
      { status: 500 }
    );
  }
}

