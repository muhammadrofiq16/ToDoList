"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

// Komponen modal konfirmasi untuk aksi berbahaya seperti hapus
// Menampilkan overlay backdrop dengan blur dan kartu konfirmasi

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus",
  loading = false,
}: ConfirmModalProps) {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Jangan render jika modal tidak terbuka
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop dengan efek blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Kartu modal */}
      <div className="relative bg-card rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
        {/* Ikon peringatan */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        {/* Judul */}
        <h3 className="text-lg font-semibold text-center text-card-foreground mb-2">
          {title}
        </h3>

        {/* Pesan */}
        <p className="text-sm text-muted text-center mb-6">
          {message}
        </p>

        {/* Tombol aksi */}
        <div className="flex gap-3 justify-end">
          {/* Tombol batal */}
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-default text-card-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            Batal
          </button>

          {/* Tombol konfirmasi */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
