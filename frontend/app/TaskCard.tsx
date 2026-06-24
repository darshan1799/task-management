"use client";

import { LuPencil, LuTrash2, LuCheck, LuCalendar } from "react-icons/lu";

type Priority = "High" | "Medium" | "Low";
type Status = "Pending" | "Completed";

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  status: Status;
  createdAt: string;
}

const priorityColors: Record<Priority, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

const priorityDot: Record<Priority, string> = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, current: Status) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskCardProps) {
  const isCompleted = task.status === "Completed";

  return (
    <div
      className={`group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleStatus(task._id, task.status)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {isCompleted && <LuCheck size={11} strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`text-sm font-medium text-gray-900 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <LuPencil size={13} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            <LuTrash2 size={13} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityDot[task.priority]}`}
          />
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <LuCalendar size={11} />
            {formatDate(task.dueDate)}
          </span>
        )}

        <span className="ml-auto text-xs text-gray-300">
          {isCompleted ? "Done" : "Pending"}
        </span>
      </div>
    </div>
  );
}
