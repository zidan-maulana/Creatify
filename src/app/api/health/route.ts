import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Healthcheck Endpoint untuk Observability & Uptime Monitoring
 * Sesuai Dokumen 09_API_CONTRACT.md Seksi 8
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  const uptime = process.uptime();

  try {
    // Verifikasi koneksi live PostgreSQL
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp,
        database: "connected",
        uptime: Math.floor(uptime),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Healthcheck database failure:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp,
        database: "disconnected",
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}

