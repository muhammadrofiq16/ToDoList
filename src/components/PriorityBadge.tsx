"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

// Komponen badge untuk menampilkan tingkat prioritas tugas
// Menampilkan ikon dan label sesuai tingkat prioritas

interface PriorityBadgeProps {
  priority: "LOW" | "MEDIUM" | "HIGH";
}

// Konfigurasi warna dan label untuk setiap prioritas
const priorityConfig = {
  LOW: {
    label: "Rendah",
    icon: ArrowDown,
    classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  MEDIUM: {
    label: "Sedang",
    icon: ArrowRight,
    classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  HIGH: {
    label: "Tinggi",
    icon: ArrowUp,
    classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.classes}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
