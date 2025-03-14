export type TaskStatus = "todo" | "in_progress" | "done" | "all";
export type TaskPriority = "low" | "medium" | "high" | "all"

export type TaskFilter = {
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
}

export type FilterCounts = {
    all: number;
    inProgress: number;
    todo: number;
    completed: number;
}