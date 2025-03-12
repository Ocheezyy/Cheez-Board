import { create } from 'zustand';

type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

type UserStore = {
    users: User[];
    addUser: (user: User) => void;
    updateUser: (id: string, updatedUser: Partial<User>) => void;
    deleteUser: (id: string) => void;
    setUsers: (users: User[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    updateUser: (id, updatedUser) =>
        set((state) => ({
            users: state.users.map((user) =>
                user.id === id ? { ...user, ...updatedUser } : user
            ),
        })),
    deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
    setUsers: (users) => set({ users }),
}));