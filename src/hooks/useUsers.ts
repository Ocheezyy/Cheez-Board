import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';

// Fetch all users
export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        },
        // @ts-expect-error Update types here
        onSuccess: (data) => {
            useUserStore.getState().setUsers(data);
        },
    });
}