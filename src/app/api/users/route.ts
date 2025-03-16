import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server"


export async function GET() {
    try {
        const client = await clerkClient()
        const users = await client.users.getUserList();
        return NextResponse.json(users.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}