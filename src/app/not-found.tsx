// Halaman 404 - Not Found
import Link from "next/link";
import { Home, CheckSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white dark:from-sage-950 dark:to-sage-900 px-4">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <CheckSquare className="w-8 h-8 text-sage-700" />
          <span className="text-2xl font-bold text-sage-700">TaskFlow</span>
        </div>

        {/* 404 Number */}
        <h1 className="text-[8rem] sm:text-[12rem] font-bold text-sage-100 dark:text-sage-900 leading-none select-none">
          404
        </h1>

        {/* Pesan */}
        <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground -mt-6 mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>

        {/* Tombol Kembali */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-medium transition-colors shadow-lg shadow-sage-700/25"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
