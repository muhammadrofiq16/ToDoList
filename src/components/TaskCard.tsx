// Komponen TaskCard - Kartu individual untuk setiap tugas
"use client";

import { Calendar, Pencil, Trash2, Check, Clock, ListTodo, ChevronRight } from "lucide-react";
import Badge from "./Badge";
import PriorityBadge from "./PriorityBadge";
import type { Task, TaskStatus } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: string) => void;
  onStatusChange?: (id: number, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({
  task,
  onToggleStatus,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === "SELESAI";
  const isProses = task.status === "PROSES";
  const isPlanning = task.status === "PLANNING";

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "SELESAI";

  // Format tanggal
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Status badge config
  const statusConfig = {
    PLANNING: {
      label: "Planning",
      classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      icon: ListTodo,
      next: "PROSES" as TaskStatus,
      nextLabel: "Mulai Kerjakan",
    },
    PROSES: {
      label: "Dalam Proses",
      classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      icon: Clock,
      next: "SELESAI" as TaskStatus,
      nextLabel: "Selesaikan",
    },
    SELESAI: {
      label: "Selesai",
      classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      icon: Check,
      next: "PLANNING" as TaskStatus,
      nextLabel: "Kembalikan ke Planning",
    },
  };

  const currentStatusConfig = statusConfig[task.status] || statusConfig.PLANNING;
  const StatusIcon = currentStatusConfig.icon;

  const handleNextStatus = () => {
    if (onStatusChange) {
      onStatusChange(task.id, currentStatusConfig.next);
    } else {
      onToggleStatus(task.id, task.status);
    }
  };

  return (
    <div
      className={`bg-card rounded-xl border border-default shadow-sm hover:shadow-md transition-all duration-200 p-4 group ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Tombol Siklus Status */}
        <button
          onClick={handleNextStatus}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted
              ? "bg-emerald-600 border-emerald-600 text-white"
              : isProses
              ? "bg-amber-500 border-amber-500 text-white animate-pulse"
              : "border-blue-400 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          }`}
          title={`Status: ${currentStatusConfig.label} (Klik untuk: ${currentStatusConfig.nextLabel})`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5" />}
          {isProses && <Clock className="w-3.5 h-3.5" />}
        </button>

        {/* Konten Tugas */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Judul */}
            <h3
              className={`font-semibold text-sm sm:text-base leading-tight ${
                isCompleted
                  ? "line-through text-muted"
                  : "text-card-foreground"
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Deskripsi */}
          {task.description && (
            <p className="text-muted text-xs sm:text-sm mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {/* Status Dropdown/Badge */}
            <div className="relative inline-flex items-center">
              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange
                    ? onStatusChange(task.id, e.target.value as TaskStatus)
                    : onToggleStatus(task.id, e.target.value)
                }
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border appearance-none cursor-pointer pr-6 focus:outline-none focus:ring-1 focus:ring-sage-500 ${currentStatusConfig.classes}`}
              >
                <option value="PLANNING">📋 Planning</option>
                <option value="PROSES">⏳ Proses</option>
                <option value="SELESAI">✅ Selesai</option>
              </select>
              <ChevronRight className="w-3 h-3 absolute right-1.5 pointer-events-none rotate-90 opacity-60" />
            </div>

            {/* Badge Kategori */}
            {task.category && (
              <Badge text={task.category.name} color={task.category.color} size="sm" />
            )}

            {/* Badge Prioritas */}
            <PriorityBadge priority={task.priority} />

            {/* Tanggal Deadline */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  isOverdue
                    ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-medium"
                    : "bg-muted text-muted"
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {isOverdue && " (Terlambat)"}
              </span>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-muted hover:text-sage-700 hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
            title="Edit tugas"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            title="Hapus tugas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
