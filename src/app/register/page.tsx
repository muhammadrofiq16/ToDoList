"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckSquare,
  Mail,
  Lock,
  Eye,
  EyeOff,
  XCircle,
  Loader2,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

// Halaman registrasi untuk membuat akun baru
export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  // State untuk form input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validasi form sebelum submit
  const validate = (): boolean => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Semua field harus diisi.");
      return false;
    }
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      return false;
    }
    return true;
  };

  // Handler submit form registrasi
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    const result = await register(name, email, password);

    if (result.success) {
      showToast("Akun berhasil dibuat! Silakan masuk.", "success");
      router.push("/login");
    } else {
      setError(result.message || "Gagal membuat akun. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 dark:bg-sage-950 px-4 py-8">
      <div className="w-full max-w-md animate-scale-in">
        {/* Kartu registrasi */}
        <div className="bg-white dark:bg-sage-900 rounded-2xl shadow-xl border border-sage-200 dark:border-sage-800 p-8">
          {/* Logo aplikasi */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <CheckSquare className="w-8 h-8 text-sage-700 dark:text-sage-400" />
            <span className="text-2xl font-bold text-sage-700 dark:text-sage-400">
              TaskFlow
            </span>
          </div>

          {/* Judul dan deskripsi */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-sage-900 dark:text-sage-100 mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-sage-600 dark:text-sage-400 text-sm">
              Daftar untuk mulai mengelola tugasmu
            </p>
          </div>

          {/* Pesan error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 mb-6 text-sm animate-fade-in">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form registrasi */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input nama lengkap */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 dark:text-sage-500" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 text-sage-900 dark:text-sage-100 placeholder-sage-400 dark:placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Input email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 dark:text-sage-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 text-sage-900 dark:text-sage-100 placeholder-sage-400 dark:placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Input password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 dark:text-sage-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat password"
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 text-sage-900 dark:text-sage-100 placeholder-sage-400 dark:placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-600 focus:border-transparent transition-all"
                />
                {/* Tombol toggle tampilkan/sembunyikan password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 dark:text-sage-500 hover:text-sage-600 dark:hover:text-sage-300 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Petunjuk persyaratan password */}
              <p className="text-xs text-sage-500 dark:text-sage-500 mt-1.5">
                Minimal 6 karakter
              </p>
            </div>

            {/* Input konfirmasi password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 dark:text-sage-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-sage-300 dark:border-sage-700 bg-white dark:bg-sage-800 text-sage-900 dark:text-sage-100 placeholder-sage-400 dark:placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-600 focus:border-transparent transition-all"
                />
                {/* Tombol toggle tampilkan/sembunyikan konfirmasi password */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 dark:text-sage-500 hover:text-sage-600 dark:hover:text-sage-300 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sage-700 hover:bg-sage-800 dark:bg-sage-600 dark:hover:bg-sage-500 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          {/* Link ke halaman login */}
          <p className="text-center text-sm text-sage-600 dark:text-sage-400 mt-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-sage-700 dark:text-sage-300 font-semibold hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
