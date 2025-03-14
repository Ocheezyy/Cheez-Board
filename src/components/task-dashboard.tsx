"use client"

import {useEffect, useMemo, useState} from "react";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { TaskHeader } from "./task-header";
import { TaskFilters } from "./task-filters";
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from "@/hooks/useTasks";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";
import { useUsers } from "@/hooks/useUsers";
import { ITask } from "@/db/models";
import { toast } from "sonner";
import { TaskFilter } from "@/lib/types";



export function TaskDashboard() {
  const { error: getTaskError } = useTasks();
  const { error: getUserError } = useUsers();
  const tasks = useTaskStore((state) => state.tasks);
  const users = useUserStore((state) => state.users);
  const { mutate: createTask } = useCreateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: updateTask } = useUpdateTask();
  const [ filter, setFilter ] = useState<TaskFilter>({
    status: "all",
    priority: "all",
    assignee: "all",
  });

  useEffect(() => {
    toast("Failed to get tasks")
  }, [ getTaskError ]);

  useEffect(() => {
    toast("Failed to get users")
  }, [ getUserError ]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      return (
          (filter.status === "all" || task.status === filter.status) &&
          (filter.priority === "all" || task.priority === filter.priority) &&
          (filter.assignee === "all" || task.userId === filter.assignee)
      )
    });
  }, [ filter, tasks ]);

  const handleCreateTask = (taskData: Omit<ITask, "_id"|"comments"|"files"|"createdAt"|"updatedAt">) => {
    createTask({
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority,
      status: taskData.status,
      userId: users[0]._id
    })
  }

  const allCount = tasks.length;
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const inProgressCount = tasks.filter((task) => task.status === "in_progress").length;
  const completedCount = tasks.filter((task) => task.status === "done").length;
  const taskCounts = {
    all: allCount,
    todo: todoCount,
    completed: completedCount,
    inProgress: inProgressCount
  }

  return (
      <div className="space-y-6">
        <TaskHeader />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <TaskFilters filter={filter} setFilter={setFilter} users={users} counts={taskCounts} />
            <div className="mt-6">
              <TaskForm onSubmit={handleCreateTask} />
            </div>
          </div>
          <div className="md:col-span-3">
            <TaskList tasks={filteredTasks} users={users} onUpdate={updateTask} onDelete={deleteTask} />
          </div>
        </div>
      </div>
  )
}

