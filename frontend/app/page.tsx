"use client";

import { useState, useEffect, useCallback } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LuPlus, LuLoader, LuClipboardList } from "react-icons/lu";

import showMessage from "@/lib/toastMessage";
import TaskModal, { TaskFormValues } from "./TaskModal";
import TaskCard from "./TaskCard";
import { LuLogOut } from "react-icons/lu";

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

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState<"All" | Status>("All");

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`,
      { credentials: "include" },
    );

    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }

    const data = await res.json();

    if (data.success) {
      setTasks(data.data);
    } else {
      showMessage(data.message || "Failed to load tasks", "error");
    }

    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const formSubmitHandler: SubmitHandler<TaskFormValues> = async (values) => {
    setFormLoading(true);

    const url = editingTask
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task/${editingTask._id}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task`;

    const res = await fetch(url, {
      method: editingTask ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!data.success) {
      showMessage(data.message || "Something went wrong", "error");
    } else {
      showMessage(
        data.message || (editingTask ? "Task updated" : "Task added"),
        "success",
      );
      setModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    }

    setFormLoading(false);
  };

  const deleteHandler = async (id: string) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    const data = await res.json();

    if (!data.success) {
      showMessage(data.message || "Failed to delete", "error");
    } else {
      showMessage(data.message || "Task deleted", "success");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const toggleStatusHandler = async (id: string, current: Status) => {
    const newStatus: Status = current === "Pending" ? "Completed" : "Pending";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${id}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      },
    );

    const data = await res.json();

    if (!data.success) {
      showMessage(data.message || "Failed to update status", "error");
    } else {
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t)),
      );
    }
  };

  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const logoutHandler = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        showMessage("Logged out successfully", "success");
        router.push("/auth/login");
        router.refresh();
      } else {
        showMessage(data.message || "Logout failed", "error");
      }
    } catch (error) {
      showMessage("Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {pendingCount} pending · {completedCount} completed
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <button
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
              className="flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:flex-initial sm:px-4"
            >
              <div className="flex items-center justify-center gap-1.5">
                <LuPlus size={15} />
                New Task
              </div>
            </button>

            <button
              onClick={logoutHandler}
              className="flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 sm:flex-initial"
            >
              <div className="flex items-center justify-center gap-1.5">
                <LuLogOut size={15} />
                Logout
              </div>
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
          {(["All", "Pending", "Completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                filter === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <LuLoader size={22} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <LuClipboardList size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              {filter === "All"
                ? "No tasks yet"
                : `No ${filter.toLowerCase()} tasks`}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {filter === "All"
                ? "Add your first task to get started."
                : `All caught up on ${filter.toLowerCase()} tasks.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setModalOpen(true);
                }}
                onDelete={deleteHandler}
                onToggleStatus={toggleStatusHandler}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={formSubmitHandler}
        isLoading={formLoading}
        editTask={editingTask}
      />
    </div>
  );
}
