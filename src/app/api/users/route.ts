import { NextResponse } from 'next/server';
import { User } from '@/db/models/user';
import { connectToDatabase } from "@/db/connect";

await connectToDatabase();

// GET all users
export async function GET() {
    try {
        const users = await User.find().select("-password");
        return NextResponse.json(users);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST a new user
export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();
        const user = await User.create({ name, email, password });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// PUT (update) a user
export async function PUT(request: Request) {
    try {
        const { id, ...updateData } = await request.json();
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE a user
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}