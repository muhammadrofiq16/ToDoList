// Komponen TodoForm - Modal form untuk tambah/edit tugas
"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { Task, Category, TaskStatus } from "@/lib/types";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    categoryId: number | null;
    status: TaskStatus;
  }) => void;
  task?: Task | null;
  categories: Category[];
  loading?: boolean;
  defaultStatus?: TaskStatus;
}

export default function TodoForm({
  isOpen,
  onClose,
  onSubmit,
  task,
  categories,
  loading = false,
  defaultStatus = "PLANNING",
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("PLANNING");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const isEditMode = !!task;

  // Pre-fill form saat edit mode
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      setCategoryId(task.categoryId);
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus(defaultStatus);
      setDueDate("");
      setCategoryId(null);
    }
    setError("");
  }, [task, isOpen, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul tugas wajib diisi");
      return;
    }
    setError("");
    onSubmit({ title, description, priority, dueDate, categoryId, status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in border border-default">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-default">
          <h2 className="text-lg font-bold text-card-foreground">
            {isEditMode ? "Edit Tugas" : "Tambah Tugas Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-card-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Judul Tugas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Selesaikan laporan tugas akhir..."
              className="w-full px-3 py-2.5 rounded-xl border border-default bg-muted text-card-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              autoFocus
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan detail tugas (opsional)..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-default bg-muted text-card-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm resize-none"
            />
          </div>

          {/* Row: Status & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Alur */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Tahap / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-default bg-muted text-card-foreground focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm font-medium"
              >
                <option value="PLANNING">📋 Planning (Rencana)</option>
                <option value="PROSES">⏳ Proses (Dikerjakan)</option>
                <option value="SELESAI">✅ Selesai</option>
              </select>
            </div>

            {/* Prioritas */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Tingkat Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-default bg-muted text-card-foreground focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              >
                <option value="LOW">🟢 Rendah</option>
                <option value="MEDIUM">🟡 Sedang</option>
                <option value="HIGH">🔴 Tinggi</option>
              </select>
            </div>
          </div>

          {/* Row: Deadline & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tanggal Deadline */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Tanggal Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-default bg-muted text-card-foreground focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Kategori
              </label>
              <select
                value={categoryId ?? ""}
                onChange={(e) =>
                  setCategoryId(e.target.value ? parseInt(e.target.value) : null)
                }
                className="w-full px-3 py-2.5 rounded-xl border border-default bg-muted text-card-foreground focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              >
                <option value="">Tanpa Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-card-foreground hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-sage-700 hover:bg-sage-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? "Perbarui" : "Simpan Tugas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
