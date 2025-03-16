import { NextResponse } from "next/server";
import { ITask, Task } from "@/db/models";
import { connectToDatabase } from "@/db/connect";
import type { CreateTaskResponse } from "@/lib/types";

await connectToDatabase();

export async function GET() {
    try {
        const tasks = await Task.find().populate("comments").populate("files");
        return NextResponse.json(tasks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, status, dueDate, userId, priority }: ITask = await request.json();
        const task = await Task.create({ title, description, status, userId, dueDate, priority });
        return NextResponse.json<CreateTaskResponse>(task, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, ...updateData } = await request.json();
        const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }
        return NextResponse.json(task);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Task deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}