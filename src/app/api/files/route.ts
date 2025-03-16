import { NextResponse } from "next/server";
import {File, Task} from "@/db/models";
import { connectToDatabase } from "@/db/connect";

await connectToDatabase();

export async function GET() {
    try {
        const files = await File.find();
        return NextResponse.json(files);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { url, key, name, size, userId, taskId } = await request.json();
        const file = await File.create({ url, key, name, size, userId, taskId });
        return NextResponse.json(file, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, ...updateData } = await request.json();
        const file = await File.findByIdAndUpdate(id, updateData, { new: true });
        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
        const task = await Task.findOne({ "files._id": id });
        return NextResponse.json({ file, taskId: task?.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const task = await Task.findOne({ "files._id": id });
        const file = await File.findByIdAndDelete(id);
        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "File deleted", taskId: task?.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}