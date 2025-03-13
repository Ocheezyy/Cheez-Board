import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskStore } from '@/stores/useTaskStore';

export function useTasks() {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await fetch('/api/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            return response.json();
        },
        // @ts-expect-error need to set types
        onSuccess: (data) => {
            useTaskStore.getState().setTasks(data);
        },
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTask: { title: string; description: string; status: string; priority: string; userId: string }) => {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) throw new Error('Failed to create task');
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().addTask(data);
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updatedTask }: { id: string; [key: string]: any }) => {
            const response = await fetch(`/api/tasks`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedTask }),
            });
            if (!response.ok) throw new Error('Failed to update task');
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(data.id, data);
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/tasks`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete task');
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().deleteTask(data.id);
        },
    });
}