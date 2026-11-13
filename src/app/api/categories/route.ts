import { NextRequest, NextResponse } from "next/server";
import { getCategoriesAction, createCategoryAction } from "@/actions/portfolio-actions";

export async function GET() {
  const result = await getCategoriesAction();
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createCategoryAction(body.name);
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
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Format data request tidak valid.",
        },
      },
      { status: 400 }
    );
  }
}
