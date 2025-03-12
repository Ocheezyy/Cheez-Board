import { NextResponse } from 'next/server';
import { Task } from '@/db/models/task';
import { connectToDatabase } from "@/db/connect";

await connectToDatabase();

// GET all tasks
export async function GET() {
    try {
        const tasks = await Task.find().populate('comments').populate('files');
        return NextResponse.json(tasks);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

// POST a new task
export async function POST(request: Request) {
    try {
        const { title, description, status, userId } = await request.json();
        const task = await Task.create({ title, description, status, userId });
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

// PUT (update) a task
export async function PUT(request: Request) {
    try {
        const { id, ...updateData } = await request.json();
        const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json(task);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

// DELETE a task
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Task deleted' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}