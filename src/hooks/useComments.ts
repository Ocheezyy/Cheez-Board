import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskStore } from '@/stores/useTaskStore';
import { IComment } from '@/db/models';

interface ICommentUpdateSuccess {
    comment: IComment;
    taskId: string;
}

interface ICommentDeleteSuccess {
    comment: IComment;
    taskId: string;
}

export function useCreateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newComment: { content: string; userId: string; taskId: string }) => {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment),
            });
            if (!response.ok) throw new Error('Failed to create comment');
            return response.json() as Promise<IComment>;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(variables.taskId, {
                comments: [...(useTaskStore.getState().tasks.find((t) => t.id === variables.taskId)?.comments || []), data],
            });
        },
    });
}


export function useUpdateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updatedComment }: { id: string; [key: string]: any }) => {
            const response = await fetch(`/api/comments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedComment }),
            });
            if (!response.ok) throw new Error('Failed to update comment');
            return response.json() as Promise<ICommentUpdateSuccess>;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(data.taskId, {
                comments: useTaskStore.getState().tasks
                    .find((t) => t.id === data.taskId)
                    ?.comments.map((c) => (c.id === data.comment.id ? data.comment : c)),
            });
        },
    });
}


export function useDeleteComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/comments`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete comment');
            return response.json() as Promise<ICommentDeleteSuccess>;
        },
        onSuccess: (data, commentId) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            useTaskStore.getState().updateTask(data.taskId, {
                comments: useTaskStore.getState().tasks
                    .find((t) => t.id === data.taskId)
                    ?.comments.filter((c) => c.id !== commentId),
            });
        },
    });
}