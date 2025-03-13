import { create } from 'zustand';
import { IUser } from "@/db/models";


type UserStore = {
    users: IUser[];
    addUser: (user: IUser) => void;
    updateUser: (id: string, updatedUser: Partial<IUser>) => void;
    deleteUser: (id: string) => void;
    setUsers: (users: IUser[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    updateUser: (id, updatedUser) =>
        set((state) => ({
            users: state.users.map((user) =>
                user._id === id ? { ...user, ...updatedUser } : user
            ),
        })),
    deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((user) => user._id !== id) })),
    setUsers: (users) => set({ users }),
}));