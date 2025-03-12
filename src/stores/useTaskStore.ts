import { create } from 'zustand';

type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    userId: string;
    comments: string[];
    files: string[];
};

type TaskStore = {
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (id: string, updatedTask: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updatedTask) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updatedTask } : task
            ),
        })),
    deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
    setTasks: (tasks) => set({ tasks }),
}));