import { create } from "zustand";
import { ITaskPopulated } from "@/db/models";


type TaskStore = {
    tasks: ITaskPopulated[];
    addTask: (task: ITaskPopulated) => void;
    updateTask: (id: string, updatedTask: Partial<ITaskPopulated>) => void;
    deleteTask: (id: string) => void;
    setTasks: (tasks: ITaskPopulated[]) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (task) => set((state) => ({ tasks: [ ...state.tasks, task ] })),
    updateTask: (id, updatedTask) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task._id === id ? { ...task, ...updatedTask } : task
            ),
        })),
    deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task._id !== id) })),
    setTasks: (tasks) => set({ tasks }),
}));