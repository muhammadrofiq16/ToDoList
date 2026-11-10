// API: /api/categories
// GET  - Menampilkan daftar kategori milik user
// POST - Membuat kategori baru

import { prisma } from "@/lib/prisma";
import { verifyAuth, jsonResponse, errorResponse } from "@/lib/auth";

// ==========================================
// GET /api/categories
// ==========================================
export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const categories = await prisma.category.findMany({
      where: { userId: auth.userId },
      include: {
        _count: {
          select: { tasks: true }, // Hitung jumlah task per kategori
        },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse(categories, 200, "Daftar kategori berhasil diambil");
  } catch (error) {
    console.error("Get categories error:", error);
    return errorResponse("Gagal mengambil daftar kategori", 500);
  }
}

// ==========================================
// POST /api/categories
// Body: { name, color? }
// ==========================================
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const body = await request.json();
    const { name, color } = body;

    // Validasi input
    if (!name || name.trim() === "") {
      return errorResponse("Nama kategori wajib diisi", 400);
    }

    // Cek duplikasi nama kategori per user
    const existing = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        userId: auth.userId,
      },
    });

    if (existing) {
      return errorResponse("Kategori dengan nama tersebut sudah ada", 409);
    }

    // Buat kategori baru
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        color: color || "#3B82F6",
        userId: auth.userId,
      },
    });

    return jsonResponse(category, 201, "Kategori berhasil ditambahkan");
  } catch (error) {
    console.error("Create category error:", error);
    return errorResponse("Gagal menambahkan kategori", 500);
  }
}
