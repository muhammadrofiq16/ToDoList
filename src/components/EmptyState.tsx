"use client";

import { ClipboardList } from "lucide-react";

// Komponen tampilan kosong ketika tidak ada tugas
// Menampilkan ikon, judul, dan deskripsi dengan styling yang halus

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Belum ada tugas",
  description = "Mulai tambahkan tugas pertamamu dengan menekan tombol di atas.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Ikon besar dengan warna muted */}
      <div className="bg-muted rounded-full p-6 mb-4">
        <ClipboardList className="w-12 h-12 text-muted" />
      </div>

      {/* Judul */}
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>

      {/* Deskripsi */}
      <p className="text-sm text-muted text-center max-w-sm">
        {description}
      </p>
    </div>
  );
}
