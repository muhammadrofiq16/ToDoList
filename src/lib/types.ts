// Shared type definitions untuk seluruh aplikasi

export type TaskStatus = "PLANNING" | "PROSES" | "SELESAI";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categoryId: number | null;
  category: { id: number; name: string; color: string } | null;
  [key: string]: unknown;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  userId: number;
  _count: { tasks: number };
}
