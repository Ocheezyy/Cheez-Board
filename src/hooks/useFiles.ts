import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskStore } from '@/stores/useTaskStore';
import { IFile } from '@/db/models';

interface IFileUpdateSuccess {
    file: IFile;
    taskId: string;
}

interface IFileDeleteSuccess {
    message: string;
    taskId: string;
}

export function useCreateFile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newFile: { url: string; key: string; name: string; size: number; userId: string; taskId: string }) => {
            const response = await fetch('/api/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFile),
            });
            if (!response.ok) throw new Error('Failed to create file');
            return response.json() as Promise<IFile>;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(variables.taskId, {
                files: [...(useTaskStore.getState().tasks.find((t) => t.id === variables.taskId)?.files || []), data],
            });
        },
    });
}

export function useUpdateFile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updatedFile }: { id: string; [key: string]: any }) => {
            const response = await fetch(`/api/files`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedFile }),
            });
            if (!response.ok) throw new Error('Failed to update file');
            return response.json() as Promise<IFileUpdateSuccess>;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(data.taskId, {
                files: useTaskStore.getState().tasks
                    .find((t) => t.id === data.taskId)
                    ?.files.map((f) => (f.id === data.file.id ? data.file : f)),
            });
        },
    });
}

export function useDeleteFile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/files`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete file');
            return response.json() as Promise<IFileDeleteSuccess>;
        },
        onSuccess: (data, fileId) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(data.taskId, {
                files: useTaskStore.getState().tasks
                    .find((t) => t.id === data.taskId)
                    ?.files.filter((f) => f.id !== fileId),
            });
        },
    });
}