// Middleware Next.js - Proteksi route yang membutuhkan login
// File ini harus ada di root folder src/

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Route yang membutuhkan login
const protectedRoutes = ["/dashboard"];

// Route yang tidak boleh diakses jika sudah login
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Cek apakah token valid
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Jika mengakses halaman yang butuh login tapi belum login → redirect ke /login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika sudah login tapi mengakses halaman login/register → redirect ke /dashboard
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi: middleware hanya berjalan di route tertentu
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
