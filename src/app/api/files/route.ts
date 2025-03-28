import { NextResponse } from "next/server";
import {File, ITask, Task} from "@/db/models";
import { connectToDatabase } from "@/db/connect";
import { UTApi } from "uploadthing/server";

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
        const { url, key, name, size, userId, taskId, type } = await request.json();
        const task: ITask | null = await Task.findById(taskId);
        if (!task) {
            const utApi = new UTApi();
            await utApi.deleteFiles([key]);
            return NextResponse.json({ error: "Cancelled upload, task not found" });
        }
        const file = await File.create({ url, key, name, size, userId, taskId: task._id, type });
        await Task.updateOne({ _id: task._id }, { $push: { files: file._id } });
        return NextResponse.json(file, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
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
        await Task.updateOne({ "files._id": id }, { $pull: { files: id }});
        return NextResponse.json({ message: "File deleted", taskId: task?.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}