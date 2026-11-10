"use client";

import { ListTodo, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import type { Task } from "@/lib/types";

interface StatsCardsProps {
  tasks: Task[];
}

// Komponen kartu statistik untuk menampilkan ringkasan tugas di dashboard
export default function StatsCards({ tasks }: StatsCardsProps) {
  // Hitung total tugas
  const totalTasks = tasks.length;

  // Hitung tugas berdasarkan 3 tahap alur
  const planningTasks = tasks.filter((t) => t.status === "PLANNING").length;
  const prosesTasks = tasks.filter((t) => t.status === "PROSES").length;
  const selesaiTasks = tasks.filter((t) => t.status === "SELESAI").length;

  // Konfigurasi untuk setiap kartu statistik (3 alur proses + total)
  const stats = [
    {
      label: "Total Tugas",
      count: totalTasks,
      icon: ListTodo,
      bgClass: "bg-sage-100 dark:bg-sage-900/40",
      iconBgClass: "bg-sage-200 dark:bg-sage-800",
      iconClass: "text-sage-700 dark:text-sage-300",
    },
    {
      label: "Planning",
      count: planningTasks,
      icon: Clock,
      bgClass: "bg-blue-50 dark:bg-blue-900/20",
      iconBgClass: "bg-blue-100 dark:bg-blue-900/40",
      iconClass: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Sedang Diproses",
      count: prosesTasks,
      icon: AlertTriangle,
      bgClass: "bg-amber-50 dark:bg-amber-900/20",
      iconBgClass: "bg-amber-100 dark:bg-amber-900/40",
      iconClass: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Selesai",
      count: selesaiTasks,
      icon: CheckCircle,
      bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBgClass: "bg-emerald-100 dark:bg-emerald-900/40",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-xl p-5 ${stat.bgClass} animate-scale-in`}
          >
            <div className="flex items-center gap-4">
              {/* Ikon statistik */}
              <div className={`p-3 rounded-lg ${stat.iconBgClass}`}>
                <Icon className={`w-6 h-6 ${stat.iconClass}`} />
              </div>
              <div>
                {/* Angka statistik */}
                <p className="text-2xl font-bold text-card-foreground">
                  {stat.count}
                </p>
                {/* Label statistik */}
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
