// API: /api/tasks
// GET  - Menampilkan daftar tugas milik user (+ filter & search)
// POST - Membuat tugas baru

import { prisma } from "@/lib/prisma";
import { verifyAuth, jsonResponse, errorResponse } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// ==========================================
// GET /api/tasks?status=PENDING&priority=HIGH&search=belajar&categoryId=1
// ==========================================
export async function GET(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    // Parse query parameters untuk filter & search
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // PLANNING | PROSES | SELESAI
    const priority = searchParams.get("priority"); // LOW | MEDIUM | HIGH
    const search = searchParams.get("search"); // Kata kunci pencarian
    const categoryId = searchParams.get("categoryId"); // Filter kategori

    // Bangun filter query secara dinamis
    const where: Prisma.TaskWhereInput = {
      userId: auth.userId,
    };

    if (status && (status === "PLANNING" || status === "PROSES" || status === "SELESAI")) {
      where.status = status;
    }

    if (priority && (priority === "LOW" || priority === "MEDIUM" || priority === "HIGH")) {
      where.priority = priority;
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Query database dengan relasi kategori
    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // PENDING di atas COMPLETED
        { priority: "desc" }, // HIGH > MEDIUM > LOW
        { createdAt: "desc" }, // Terbaru di atas
      ],
    });

    return jsonResponse(tasks, 200, "Daftar tugas berhasil diambil");
  } catch (error) {
    console.error("Get tasks error:", error);
    return errorResponse("Gagal mengambil daftar tugas", 500);
  }
}

// ==========================================
// POST /api/tasks
// Body: { title, description?, priority?, dueDate?, categoryId? }
// ==========================================
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) return errorResponse("Silakan login terlebih dahulu", 401);

    const body = await request.json();
    const { title, description, priority, dueDate, categoryId, status } = body;

    // Validasi input
    if (!title || title.trim() === "") {
      return errorResponse("Judul tugas wajib diisi", 400);
    }

    // Validasi kategori milik user (jika diberikan)
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: auth.userId },
      });
      if (!category) {
        return errorResponse("Kategori tidak ditemukan", 404);
      }
    }

    // Buat tugas baru
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status && ["PLANNING", "PROSES", "SELESAI"].includes(status) ? status : "PLANNING",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: auth.userId,
        categoryId: categoryId || null,
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

    return jsonResponse(task, 201, "Tugas berhasil ditambahkan");
  } catch (error) {
    console.error("Create task error:", error);
    return errorResponse("Gagal menambahkan tugas", 500);
  }
}
