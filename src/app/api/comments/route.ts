import { NextResponse } from 'next/server';
import { Comment } from '@/db/models/comment';
import { connectToDatabase } from "@/db/connect";

await connectToDatabase();

// GET all comments
export async function GET() {
    try {
        const comments = await Comment.find();
        return NextResponse.json(comments);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST a new comment
export async function POST(request: Request) {
    try {
        const { content, userId, taskId } = await request.json();
        const comment = await Comment.create({ content, userId, taskId });
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}

// PUT (update) a comment
export async function PUT(request: Request) {
    try {
        const { id, ...updateData } = await request.json();
        const comment = await Comment.findByIdAndUpdate(id, updateData, { new: true });
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        return NextResponse.json(comment);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }
}

// DELETE a comment
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Comment deleted' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}