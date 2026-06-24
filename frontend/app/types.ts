export type Priority = "High" | "Medium" | "Low";
export type Status = "Pending" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
}