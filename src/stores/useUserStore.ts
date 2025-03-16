import { create } from "zustand";
import type { IUser } from "@/lib/types";


type UserStore = {
    users: IUser[];
    setUsers: (users: IUser[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
}));