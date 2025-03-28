import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTaskStore } from "@/stores/useTaskStore";
import { ITaskPopulated } from "@/db/models";

export function useTasks() {
    const { data, isLoading, error, isSuccess }  = useQuery({
        queryKey: [ "tasks" ],
        queryFn: async () => {
            const response = await fetch("/api/tasks");
            if (!response.ok) throw new Error("Failed to fetch tasks");
            return response.json();
        },
    });

    const setTasks = useTaskStore((state) => state.setTasks);

    useEffect(() => {
        if (data) {
            setTasks(data);
        }
    }, [ data, setTasks ]);

    return { data, isLoading, error, isSuccess };
}

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTask: { title: string; description: string; status: string; priority: string; userId: string, dueDate: Date }) => {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) throw new Error("Failed to create task");
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [ "tasks" ] });
            useTaskStore.getState().addTask(data);
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ _id, ...updatedTask }: Partial<ITaskPopulated>) => {
            const response = await fetch("/api/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id, ...updatedTask }),
            });
            if (!response.ok) throw new Error("Failed to update task");
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [ "tasks" ] });
            useTaskStore.getState().updateTask(data._id, data);
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch("/api/tasks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error("Failed to delete task");
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [ "tasks" ] });
            useTaskStore.getState().deleteTask(data._id);
        },
    });
}