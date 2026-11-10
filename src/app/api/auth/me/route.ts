// API: GET /api/auth/me
// Fungsi: Mengambil data user yang sedang login dari JWT token

import { prisma } from "@/lib/prisma";
import { verifyAuth, jsonResponse, errorResponse } from "@/lib/auth";

export async function GET() {
  try {
    // Verifikasi token
    const auth = await verifyAuth();

    if (!auth) {
      return errorResponse("Silakan login terlebih dahulu", 401);
    }

    // Ambil data user dari database (tanpa password)
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse("User tidak ditemukan", 404);
    }

    return jsonResponse(user, 200, "Data user berhasil diambil");
  } catch (error) {
    console.error("Get me error:", error);
    return errorResponse("Gagal mengambil data user", 500);
  }
}
