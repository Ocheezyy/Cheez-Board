import type { ITask } from "@/db/models";

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

export type IUser = {
    id: string;
    username: string;
    hasImage: string;
    externalId: string;
    banned: boolean;
    image_url: string;
    primaryEmailAddressId: string;
    emailAddresses: {
        id: string;
        emailAddress: string;
    }[]
}

export type CreateTaskResponse = {
    task: ITask;
    status: number;
}