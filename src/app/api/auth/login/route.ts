// API: POST /api/auth/login
// Fungsi: Login pengguna dan mengembalikan JWT token via cookie

import { prisma } from "@/lib/prisma";
import { createToken, jsonResponse, errorResponse } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return errorResponse("Email dan password wajib diisi", 400);
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse("Email atau password salah", 401);
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse("Email atau password salah", 401);
    }

    // Buat JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
    });

    // Set token di cookie httpOnly (lebih aman dari localStorage)
    const response = jsonResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      200,
      "Login berhasil"
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Gagal melakukan login", 500);
  }
}
