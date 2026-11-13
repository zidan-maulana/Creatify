import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "creatify_admin_session";

function getAuthSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    "eb4f0cc352c7e11fc8e483c1e1857b5eef9b588ba946481686b3cc0f41f72833";
  return new TextEncoder().encode(secret);
}

async function isSessionValid(token: string): Promise<boolean> {
  try {
    const secretKey = getAuthSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return typeof payload.userId === "string" && typeof payload.email === "string";
  } catch {
    return false;
  }
}

/**
 * Next.js Middleware: Proteksi Seluruh Rute /admin/*
 * Sesuai Dokumen 04_SYSTEM_DESIGN.md dan ADR-003
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya periksa rute dalam lingkup /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authenticated = token ? await isSessionValid(token) : false;

  const isLoginPage = pathname === "/admin/login";

  // 1. Jika sudah login dan membuka /admin/login, alihkan ke overview dashboard
  if (isLoginPage && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Jika belum login dan sedang berada di halaman login, izinkan akses
  if (isLoginPage && !authenticated) {
    return NextResponse.next();
  }

  // 3. Jika belum login dan mencoba mengakses rute terproteksi /admin/*, redirect ke /admin/login
  if (!authenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 4. Sesi valid, izinkan request menuju halaman admin
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

