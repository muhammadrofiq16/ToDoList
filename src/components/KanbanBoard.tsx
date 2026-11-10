// Komponen KanbanBoard - Tampilan Papan Kolom (Planning, Proses, Selesai)
"use client";

import { ListTodo, Clock, CheckCircle, Plus, Calendar, Pencil, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import Badge from "./Badge";
import PriorityBadge from "./PriorityBadge";
import type { Task, TaskStatus } from "@/lib/types";

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: number, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onAddTaskWithStatus?: (status: TaskStatus) => void;
}

export default function KanbanBoard({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onAddTaskWithStatus,
}: KanbanBoardProps) {
  const columns: {
    status: TaskStatus;
    title: string;
    icon: typeof ListTodo;
    headerColor: string;
    borderCol: string;
    bgCol: string;
  }[] = [
    {
      status: "PLANNING",
      title: "Planning",
      icon: ListTodo,
      headerColor: "text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60",
      borderCol: "border-blue-200 dark:border-blue-900/50",
      bgCol: "bg-blue-50/50 dark:bg-blue-950/20",
    },
    {
      status: "PROSES",
      title: "Sedang Diproses",
      icon: Clock,
      headerColor: "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60",
      borderCol: "border-amber-200 dark:border-amber-900/50",
      bgCol: "bg-amber-50/50 dark:bg-amber-950/20",
    },
    {
      status: "SELESAI",
      title: "Selesai",
      icon: CheckCircle,
      headerColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60",
      borderCol: "border-emerald-200 dark:border-emerald-900/50",
      bgCol: "bg-emerald-50/50 dark:bg-emerald-950/20",
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {columns.map((col) => {
        const Icon = col.icon;
        const columnTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className={`rounded-2xl border ${col.borderCol} ${col.bgCol} p-4 flex flex-col min-h-[450px] shadow-sm`}
          >
            {/* Header Kolom */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-default/50">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${col.headerColor}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm sm:text-base text-card-foreground">
                  {col.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-card text-muted border border-default">
                  {columnTasks.length}
                </span>
              </div>

              {onAddTaskWithStatus && (
                <button
                  onClick={() => onAddTaskWithStatus(col.status)}
                  className="p-1 rounded-lg text-muted hover:text-card-foreground hover:bg-card transition-colors"
                  title={`Tambah di ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List Kartu Kanban */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="text-center py-12 px-2 text-muted text-xs">
                  Tidak ada tugas di tahap ini
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "SELESAI";

                  return (
                    <div
                      key={task.id}
                      className="bg-card rounded-xl border border-default p-3.5 shadow-sm hover:shadow-md transition-all group"
                    >
                      {/* Judul & Aksi */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4
                          className={`font-semibold text-sm leading-snug ${
                            task.status === "SELESAI"
                              ? "line-through text-muted"
                              : "text-card-foreground"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => onEdit(task)}
                            className="p-1 rounded text-muted hover:text-sage-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="p-1 rounded text-muted hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Deskripsi */}
                      {task.description && (
                        <p className="text-muted text-xs mb-2.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {task.category && (
                          <Badge text={task.category.name} color={task.category.color} size="sm" />
                        )}
                        <PriorityBadge priority={task.priority} />
                        {task.dueDate && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full ${
                              isOverdue
                                ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-medium"
                                : "bg-muted text-muted"
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>

                      {/* Tombol Pindah Alur */}
                      <div className="flex items-center justify-between pt-2 border-t border-default/40 text-xs">
                        {col.status === "PROSES" && (
                          <button
                            onClick={() => onStatusChange(task.id, "PLANNING")}
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            Planning
                          </button>
                        )}
                        {col.status === "SELESAI" && (
                          <button
                            onClick={() => onStatusChange(task.id, "PROSES")}
                            className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            Proses
                          </button>
                        )}

                        <div className="ml-auto">
                          {col.status === "PLANNING" && (
                            <button
                              onClick={() => onStatusChange(task.id, "PROSES")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium hover:bg-amber-200 transition-colors"
                            >
                              Proses
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.status === "PROSES" && (
                            <button
                              onClick={() => onStatusChange(task.id, "SELESAI")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium hover:bg-emerald-200 transition-colors"
                            >
                              Selesai
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
