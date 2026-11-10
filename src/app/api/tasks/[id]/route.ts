// API: /api/tasks/[id]
// GET    - Detail satu tugas
// PUT    - Update tugas (termasuk toggle status)
// DELETE - Hapus tugas

import { prisma } from "@/lib/prisma";
import { verifyAuth, jsonResponse, errorResponse } from "@/lib/auth";
import { NextRequest } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ==========================================
// GET /api/tasks/:id
// ==========================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const { id } = await params;
    const taskId = parseInt(id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: auth.userId, // Pastikan task milik user
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!task) {
      return errorResponse("Tugas tidak ditemukan", 404);
    }

    return jsonResponse(task, 200, "Detail tugas berhasil diambil");
  } catch (error) {
    console.error("Get task error:", error);
    return errorResponse("Gagal mengambil detail tugas", 500);
  }
}

// ==========================================
// PUT /api/tasks/:id
// Body: { title?, description?, status?, priority?, dueDate?, categoryId? }
// ==========================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const { id } = await params;
    const taskId = parseInt(id);

    // Cek apakah task ada dan milik user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: auth.userId },
    });

    if (!existingTask) {
      return errorResponse("Tugas tidak ditemukan", 404);
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate, categoryId } = body;

    // Validasi kategori jika diberikan
    if (categoryId !== undefined && categoryId !== null) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: auth.userId },
      });
      if (!category) {
        return errorResponse("Kategori tidak ditemukan", 404);
      }
    }

    // Update tugas
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status !== undefined && ["PLANNING", "PROSES", "SELESAI"].includes(status) && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return jsonResponse(task, 200, "Tugas berhasil diperbarui");
  } catch (error) {
    console.error("Update task error:", error);
    return errorResponse("Gagal memperbarui tugas", 500);
  }
}

// ==========================================
// DELETE /api/tasks/:id
// ==========================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const { id } = await params;
    const taskId = parseInt(id);

    // Cek apakah task ada dan milik user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: auth.userId },
    });

    if (!existingTask) {
      return errorResponse("Tugas tidak ditemukan", 404);
    }

    // Hapus tugas
    await prisma.task.delete({
      where: { id: taskId },
    });

    return jsonResponse(null, 200, "Tugas berhasil dihapus");
  } catch (error) {
    console.error("Delete task error:", error);
    return errorResponse("Gagal menghapus tugas", 500);
  }
}
