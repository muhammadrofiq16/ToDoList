// Halaman Dashboard - Halaman utama manajemen tugas (Planning, Proses, Selesai)
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import TaskList from "@/components/TaskList";
import KanbanBoard from "@/components/KanbanBoard";
import TodoForm from "@/components/TodoForm";
import CategoryModal from "@/components/CategoryModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Search, Plus, Filter, Loader2, LayoutList, Columns3 } from "lucide-react";
import type { Task, Category, TaskStatus } from "@/lib/types";

// ==========================================
// Loading Skeleton
// ==========================================
function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-default p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-sage-100 dark:bg-sage-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-sage-100 dark:bg-sage-800 rounded w-3/4" />
              <div className="h-3 bg-sage-100 dark:bg-sage-800 rounded w-1/2" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 w-16 bg-sage-100 dark:bg-sage-800 rounded-full" />
                <div className="h-5 w-14 bg-sage-100 dark:bg-sage-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Dashboard Page Component
// ==========================================
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // View Mode: 'list' atau 'kanban'
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Modals
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [formDefaultStatus, setFormDefaultStatus] = useState<TaskStatus>("PLANNING");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==========================================
  // Data Fetching
  // ==========================================
  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      // Di Kanban, tampilkan semua status agar kolom terisi
      if (viewMode === "list" && statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      if (categoryFilter !== "ALL") params.set("categoryId", categoryFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch {
      showToast("Gagal mengambil data tugas", "error");
    } finally {
      setLoadingTasks(false);
    }
  }, [viewMode, statusFilter, categoryFilter, searchQuery, showToast]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTasks(true);
      fetchTasks();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Refetch when filter changes
  useEffect(() => {
    setLoadingTasks(true);
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, viewMode]);

  // ==========================================
  // CRUD Operations
  // ==========================================
  const handleCreateOrUpdate = async (formData: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    categoryId: number | null;
    status: TaskStatus;
  }) => {
    setFormLoading(true);
    try {
      const url = editingTask
        ? `/api/tasks/${editingTask.id}`
        : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showToast(
          editingTask
            ? "Tugas berhasil diperbarui"
            : "Tugas berhasil ditambahkan",
          "success"
        );
        setShowTodoForm(false);
        setEditingTask(null);
        fetchTasks();
        fetchCategories();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Gagal menyimpan tugas", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        const messages: Record<TaskStatus, string> = {
          PLANNING: "Tugas masuk tahap Planning 📋",
          PROSES: "Tugas mulai dikerjakan (Proses) ⏳",
          SELESAI: "Tugas selesai dikerjakan! 🎉",
        };
        showToast(messages[newStatus] || "Status diperbarui", "success");
        fetchTasks();
        fetchCategories();
      }
    } catch {
      showToast("Gagal mengubah status tugas", "error");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus: Record<string, TaskStatus> = {
      PLANNING: "PROSES",
      PROSES: "SELESAI",
      SELESAI: "PLANNING",
    };
    const targetStatus = nextStatus[currentStatus] || "PLANNING";
    await handleStatusChange(id, targetStatus);
  };

  const handleDelete = async () => {
    if (!deleteTaskId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/tasks/${deleteTaskId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Tugas berhasil dihapus", "success");
        setDeleteTaskId(null);
        fetchTasks();
        fetchCategories();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Gagal menghapus tugas", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowTodoForm(true);
  };

  const handleOpenCreate = (defaultStat: TaskStatus = "PLANNING") => {
    setEditingTask(null);
    setFormDefaultStatus(defaultStat);
    setShowTodoForm(true);
  };

  // ==========================================
  // Format Tanggal Hari Ini
  // ==========================================
  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ==========================================
  // Loading Auth
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white dark:from-sage-950 dark:to-sage-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sage-700 animate-spin" />
          <p className="text-muted text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
        {/* ===== Header Sapaan & Switcher View ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">
              Halo, {user?.name}! 👋
            </h1>
            <p className="text-muted mt-1">{todayFormatted}</p>
          </div>

          {/* Toggle Tampilan: List vs Kanban Board */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-muted p-1 rounded-xl border border-default">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted hover:text-card-foreground"
                }`}
                title="Tampilan Daftar"
              >
                <LayoutList className="w-4 h-4" />
                Daftar
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted hover:text-card-foreground"
                }`}
                title="Tampilan Papan Kanban"
              >
                <Columns3 className="w-4 h-4" />
                Papan Kanban
              </button>
            </div>
          </div>
        </div>

        {/* ===== Statistik 3 Alur (Total, Planning, Proses, Selesai) ===== */}
        <div className="mb-6">
          <StatsCards tasks={tasks} />
        </div>

        {/* ===== Bar Kontrol (Search, Filter, Tambah) ===== */}
        <div className="mb-6 space-y-4">
          {/* Baris 1: Search + Tombol Tambah */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Pencarian */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-default bg-card text-card-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Tombol Tambah (desktop) */}
            <button
              onClick={() => handleOpenCreate("PLANNING")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white text-sm font-medium transition-colors shadow-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Tambah Tugas
            </button>
          </div>

          {/* Baris 2: Filter Status (di mode List) + Filter Kategori */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {viewMode === "list" ? (
              /* Tab Filter 3 Status */
              <div className="flex bg-muted rounded-xl p-1 gap-1 overflow-x-auto max-w-full">
                {[
                  { value: "ALL", label: "Semua" },
                  { value: "PLANNING", label: "📋 Planning" },
                  { value: "PROSES", label: "⏳ Proses" },
                  { value: "SELESAI", label: "✅ Selesai" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      statusFilter === tab.value
                        ? "bg-sage-700 text-white shadow-sm"
                        : "text-muted hover:text-card-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">
                Papan Kanban: Geser / alihkan tugas antar kolom alur kerja
              </p>
            )}

            {/* Filter Kategori & Kelola */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <div className="relative flex-1 sm:flex-initial">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto pl-8 pr-8 py-1.5 rounded-lg border border-default bg-card text-card-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 appearance-none cursor-pointer"
                >
                  <option value="ALL">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tombol Kelola Kategori */}
              <button
                onClick={() => setShowCategoryModal(true)}
                className="text-xs sm:text-sm text-sage-700 hover:text-sage-800 font-medium hover:underline transition-colors whitespace-nowrap"
              >
                Kelola Kategori
              </button>
            </div>
          </div>
        </div>

        {/* ===== Konten Tugas: List View ATAU Kanban View ===== */}
        {loadingTasks ? (
          <TaskSkeleton />
        ) : viewMode === "list" ? (
          <TaskList
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteTaskId(id)}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteTaskId(id)}
            onAddTaskWithStatus={(stat) => handleOpenCreate(stat)}
          />
        )}
      </main>

      {/* ===== Floating Action Button (Mobile) ===== */}
      <button
        onClick={() => handleOpenCreate("PLANNING")}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-sage-700 hover:bg-sage-800 text-white shadow-xl shadow-sage-700/30 flex items-center justify-center transition-all active:scale-95 z-30"
        title="Tambah Tugas"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ===== Modals ===== */}
      <TodoForm
        isOpen={showTodoForm}
        onClose={() => {
          setShowTodoForm(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        categories={categories}
        loading={formLoading}
        defaultStatus={formDefaultStatus}
      />

      <ConfirmModal
        isOpen={deleteTaskId !== null}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleDelete}
        title="Hapus Tugas"
        message="Yakin ingin menghapus tugas ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Ya, Hapus"
        loading={deleteLoading}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onCategoryChange={() => {
          fetchCategories();
          fetchTasks();
        }}
      />
    </div>
  );
}
