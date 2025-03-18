import { NextResponse } from "next/server";
import { Comment } from "@/db/models/comment";
import { connectToDatabase } from "@/db/connect";
import { ITask, Task } from "@/db/models";

await connectToDatabase();

export async function GET() {
    try {
        const comments = await Comment.find();
        return NextResponse.json(comments);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { content, userId, taskId } = await request.json();
        const task: ITask | null = await Task.findById(taskId);
        if (!task) {
            return NextResponse.json({ error: "Cancelled comment, task not found" });
        }
        const comment = await Comment.create({ content, userId, taskId });
        await Task.updateOne({ _id: task._id }, { $push: { comments: comment._id } });
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const task = await Task.findOne({ "comments._id": id });
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }
        await Task.updateOne({ "comments._id": id }, { $pull: { comments: id }});
        return NextResponse.json({ message: "Comment deleted", taskId: task?.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}