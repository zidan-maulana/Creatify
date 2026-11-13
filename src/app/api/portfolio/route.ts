import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioItemsAction,
  createPortfolioItemAction,
} from "@/actions/portfolio-actions";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category") || undefined;
  const featuredParam = searchParams.get("featured");
  const featured =
    featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;

  const result = await getPortfolioItemsAction({ categorySlug, featured });
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createPortfolioItemAction(body);
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
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Format data karya tidak valid.",
        },
      },
      { status: 400 }
    );
  }
}

