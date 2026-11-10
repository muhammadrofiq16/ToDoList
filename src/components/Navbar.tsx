"use client";

import { useState } from "react";
import { CheckSquare, Sun, Moon, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Komponen navbar utama untuk dashboard
export default function Navbar() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle dark mode dengan menambah/hapus class 'dark' pada elemen html
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // Handler logout
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 bg-sage-700 dark:bg-sage-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo dan nama aplikasi */}
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Tombol toggle dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Nama pengguna */}
            {user && (
              <span className="text-sm font-medium opacity-90">
                Halo, {user.name}
              </span>
            )}

            {/* Tombol logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Tombol hamburger untuk mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile yang bisa dibuka/tutup */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 animate-slide-up">
          <div className="px-4 py-3 space-y-3">
            {/* Nama pengguna di mobile */}
            {user && (
              <p className="text-sm font-medium opacity-90 px-2">
                Halo, {user.name}
              </p>
            )}

            {/* Tombol toggle dark mode di mobile */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? "Mode Terang" : "Mode Gelap"}</span>
            </button>

            {/* Tombol logout di mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
