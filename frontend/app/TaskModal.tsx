"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { LuX, LuChevronDown } from "react-icons/lu";
import { Task } from "./page";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["High", "Medium", "Low"]),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<TaskFormValues>;
  isLoading: boolean;
  editTask: Task | null;
}

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  editTask,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (editTask) {
      reset({
        title: editTask.title,
        description: editTask.description || "",
        priority: editTask.priority,
        dueDate: editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({ title: "", description: "", priority: "Medium", dueDate: "" });
    }
  }, [editTask, open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTask ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <LuX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              {...register("title")}
              placeholder="What needs to be done?"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Add more details..."
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Priority
              </label>
              <div className="relative mt-1">
                <select
                  {...register("priority")}
                  className="w-full appearance-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <LuChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-3 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Due date{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                {...register("dueDate")}
                type="date"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg cursor-pointer border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-black py-2 text-sm font-medium cursor-pointer text-white disabled:bg-gray-400"
            >
              {isLoading ? "Saving..." : editTask ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
