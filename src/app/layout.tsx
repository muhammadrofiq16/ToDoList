// Root Layout - Wraps entire app with providers
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ThemeInitializer from "@/components/ThemeInitializer";

export const metadata: Metadata = {
  title: "TaskFlow - Kelola Tugasmu dengan Mudah",
  description: "Aplikasi To-Do List modern untuk mengelola tugas harian, sekolah, dan pekerjaan dengan efisien.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ToastProvider>
            <ThemeInitializer />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
