// API: POST /api/auth/register
// Fungsi: Mendaftarkan akun pengguna baru

import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validasi input
    if (!name || !email || !password) {
      return errorResponse("Nama, email, dan password wajib diisi", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password minimal 6 karakter", 400);
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("Email sudah terdaftar", 409);
    }

    // Hash password dengan bcrypt (salt round 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Buat kategori default untuk user baru
    await prisma.category.createMany({
      data: [
        { name: "Pribadi", color: "#3B82F6", userId: user.id },
        { name: "Sekolah", color: "#10B981", userId: user.id },
        { name: "Pekerjaan", color: "#F59E0B", userId: user.id },
      ],
    });

    return jsonResponse(user, 201, "Registrasi berhasil");
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Gagal melakukan registrasi", 500);
  }
}
