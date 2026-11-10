// API: /api/categories/[id]
// PUT    - Update kategori
// DELETE - Hapus kategori

import { prisma } from "@/lib/prisma";
import { verifyAuth, jsonResponse, errorResponse } from "@/lib/auth";
import { NextRequest } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ==========================================
// PUT /api/categories/:id
// Body: { name?, color? }
// ==========================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const { id } = await params;
    const categoryId = parseInt(id);

    // Cek apakah kategori ada dan milik user
    const existingCategory = await prisma.category.findFirst({
      where: { id: categoryId, userId: auth.userId },
    });

    if (!existingCategory) {
      return errorResponse("Kategori tidak ditemukan", 404);
    }

    const body = await request.json();
    const { name, color } = body;

    // Cek duplikasi nama jika nama diubah
    if (name && name.trim() !== existingCategory.name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          name: name.trim(),
          userId: auth.userId,
          id: { not: categoryId },
        },
      });

      if (duplicate) {
        return errorResponse("Kategori dengan nama tersebut sudah ada", 409);
      }
    }

    // Update kategori
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(color !== undefined && { color }),
      },
    });

    return jsonResponse(category, 200, "Kategori berhasil diperbarui");
  } catch (error) {
    console.error("Update category error:", error);
    return errorResponse("Gagal memperbarui kategori", 500);
  }
}

// ==========================================
// DELETE /api/categories/:id
// ==========================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const { id } = await params;
    const categoryId = parseInt(id);

    // Cek apakah kategori ada dan milik user
    const existingCategory = await prisma.category.findFirst({
      where: { id: categoryId, userId: auth.userId },
    });

    if (!existingCategory) {
      return errorResponse("Kategori tidak ditemukan", 404);
    }

    // Hapus kategori (task yang terkait akan set categoryId = null karena onDelete: SetNull)
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return jsonResponse(null, 200, "Kategori berhasil dihapus");
  } catch (error) {
    console.error("Delete category error:", error);
    return errorResponse("Gagal menghapus kategori", 500);
  }
}
