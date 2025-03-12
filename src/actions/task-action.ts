"use server"
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { NewTask, Task } from "@/db/types";
import { revalidatePath } from "next/cache";

export const getTasks = async () => {
    return db.select().from(tasks);
}

export const createTask = async (task: NewTask): Promise<void> => {
    await db.insert(tasks).values(task);
}

export const deleteTask = async (taskId: number): Promise<void> => {
    await db.delete(tasks).where(eq(tasks.id, taskId));
}

export const editTask = async (task: Task): Promise<void> => {
    await db.update(tasks)
        .set({
            title: task.title,
            description: task.description,
            status: task.status,
            userId: task.userId,
        })
        .where(eq(tasks.id, task.id))
    revalidatePath("/");
}