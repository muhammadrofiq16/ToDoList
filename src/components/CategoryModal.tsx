// Komponen CategoryModal - Modal kelola kategori
"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import type { Category } from "@/lib/types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoryChange: () => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onCategoryChange,
}: CategoryModalProps) {
  const { showToast } = useToast();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Tambah kategori baru
  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Kategori berhasil ditambahkan", "success");
        setNewName("");
        setNewColor("#3B82F6");
        onCategoryChange();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Gagal menambahkan kategori", "error");
    } finally {
      setAdding(false);
    }
  };

  // Mulai edit
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  // Simpan edit
  const handleEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, color: editColor }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Kategori berhasil diperbarui", "success");
        setEditingId(null);
        onCategoryChange();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Gagal memperbarui kategori", "error");
    }
  };

  // Hapus kategori
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Kategori berhasil dihapus", "success");
        setDeletingId(null);
        onCategoryChange();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Gagal menghapus kategori", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md animate-scale-in border border-default max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-default">
          <h2 className="text-lg font-bold text-card-foreground">Kelola Kategori</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-card-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Tambah */}
        <div className="p-4 border-b border-default">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-9 h-9 rounded-lg border border-default cursor-pointer bg-transparent flex-shrink-0"
              title="Pilih warna"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama kategori baru..."
              className="flex-1 px-3 py-2 rounded-xl border border-default bg-muted text-card-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage-500 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="p-2 rounded-xl bg-sage-700 hover:bg-sage-800 text-white transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Daftar Kategori */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.length === 0 ? (
            <p className="text-center text-muted text-sm py-6">Belum ada kategori</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 p-3 rounded-xl bg-muted group"
              >
                {editingId === cat.id ? (
                  /* Mode Edit */
                  <>
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-default cursor-pointer bg-transparent flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg border border-default bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                      onKeyDown={(e) => e.key === "Enter" && handleEdit(cat.id)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(cat.id)}
                      className="p-1.5 rounded-lg text-sage-700 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg text-muted hover:bg-card transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : deletingId === cat.id ? (
                  /* Konfirmasi Hapus */
                  <>
                    <span className="flex-1 text-sm text-red-600 dark:text-red-400 font-medium">
                      Hapus &quot;{cat.name}&quot;?
                    </span>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1 rounded-lg bg-muted text-card-foreground text-xs font-medium hover:bg-card transition-colors border border-default"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  /* Mode Tampilan Normal */
                  <>
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="flex-1 text-sm font-medium text-card-foreground">
                      {cat.name}
                    </span>
                    <span className="text-xs text-muted bg-card px-2 py-0.5 rounded-full">
                      {cat._count.tasks} tugas
                    </span>
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 rounded-lg text-muted hover:text-sage-700 hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(cat.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
