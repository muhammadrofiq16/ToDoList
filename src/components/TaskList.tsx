// Komponen TaskList - Wrapper untuk daftar TaskCard
"use client";

import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import type { Task, TaskStatus } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: number, currentStatus: string) => void;
  onStatusChange?: (id: number, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  onToggleStatus,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
        >
          <TaskCard
            task={task}
            onToggleStatus={onToggleStatus}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
