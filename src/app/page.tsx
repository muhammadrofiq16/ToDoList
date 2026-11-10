// Halaman Landing Page - Publik
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  CheckSquare,
  ListTodo,
  Tag,
  AlertTriangle,
  Smartphone,
  ArrowRight,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-sage-950/80 backdrop-blur-md border-b border-default">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-sage-700" />
            <span className="text-xl font-bold text-sage-700">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-sage-700 hover:bg-sage-800 text-white text-sm font-medium transition-colors"
              >
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sage-700 hover:bg-sage-50 dark:hover:bg-sage-900 text-sm font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-sage-700 hover:bg-sage-800 text-white text-sm font-medium transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-sage-100 dark:from-sage-950 dark:via-sage-950 dark:to-sage-900" />
        {/* Dekorasi */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-200/30 dark:bg-sage-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sage-300/20 dark:bg-sage-700/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Teks Hero */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 text-sm font-medium mb-6">
              <CheckSquare className="w-4 h-4" />
              Aplikasi To-Do List Modern
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-card-foreground leading-tight mb-6">
              Kelola Tugasmu{" "}
              <span className="text-sage-700">dengan Lebih Mudah</span>
            </h1>
            <p className="text-lg text-muted max-w-lg mb-8 leading-relaxed">
              TaskFlow membantu kamu mengorganisir tugas harian, sekolah, dan
              pekerjaan dalam satu tempat yang simpel dan terstruktur.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-medium transition-all shadow-lg shadow-sage-700/25 hover:shadow-xl hover:shadow-sage-700/30"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-sage-700 text-sage-700 font-medium hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* Mockup Kartu Tugas */}
          <div className="hidden lg:block animate-slide-up">
            <div className="relative">
              {/* Kartu Utama */}
              <div className="bg-card rounded-2xl shadow-2xl border border-default p-6 space-y-4 rotate-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-800 flex items-center justify-center">
                    <ListTodo className="w-5 h-5 text-sage-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Tugas Hari Ini</h3>
                    <p className="text-xs text-muted">3 dari 5 selesai</p>
                  </div>
                </div>
                {[
                  { done: true, text: "Review materi UKK", cat: "Sekolah", color: "#10B981" },
                  { done: true, text: "Deploy ke Vercel", cat: "Pekerjaan", color: "#F59E0B" },
                  { done: false, text: "Belajar Next.js API", cat: "Sekolah", color: "#10B981" },
                  { done: false, text: "Siapkan presentasi", cat: "Sekolah", color: "#10B981" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        item.done
                          ? "bg-sage-700 border-sage-700"
                          : "border-sage-300 dark:border-sage-600"
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        item.done
                          ? "line-through text-muted"
                          : "text-card-foreground font-medium"
                      }`}
                    >
                      {item.text}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                      }}
                    >
                      {item.cat}
                    </span>
                  </div>
                ))}
              </div>
              {/* Kartu Stats Kecil */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl border border-default p-4 -rotate-3">
                <div className="text-2xl font-bold text-sage-700">87%</div>
                <div className="text-xs text-muted">Tingkat Penyelesaian</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-4">
              Fitur yang Membantumu{" "}
              <span className="text-sage-700">Produktif</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Dirancang untuk memenuhi kebutuhan manajemen tugas yang simpel namun
              lengkap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ListTodo,
                title: "Kelola Tugas",
                desc: "Buat, edit, dan hapus tugas dengan mudah. Tandai selesai dengan sekali klik.",
              },
              {
                icon: Tag,
                title: "Kategori & Label",
                desc: "Kelompokkan tugas berdasarkan topik dengan badge warna yang menarik.",
              },
              {
                icon: AlertTriangle,
                title: "Prioritas Tugas",
                desc: "Tandai tingkat kepentingan tugas dari rendah hingga tinggi.",
              },
              {
                icon: Smartphone,
                title: "Responsif",
                desc: "Akses tugasmu dari perangkat apapun, kapanpun, dimanapun.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-default p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-800 flex items-center justify-center mb-4 group-hover:bg-sage-700 transition-colors">
                  <feature.icon className="w-6 h-6 text-sage-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-br from-sage-700 to-sage-900 rounded-3xl p-10 sm:p-14 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Siap Mengelola Tugasmu?
            </h2>
            <p className="text-sage-200 mb-8 max-w-lg mx-auto">
              Bergabung sekarang dan rasakan kemudahan dalam mengatur tugas
              harianmu.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-sage-700 font-semibold hover:bg-sage-50 transition-colors shadow-lg"
            >
              Mulai Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-sage-900 dark:bg-sage-950 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sage-400" />
              <span className="font-semibold text-white">TaskFlow</span>
            </div>
            <p className="text-sage-400 text-sm">
              © 2024 TaskFlow. Dibuat untuk UKK PPLG.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
