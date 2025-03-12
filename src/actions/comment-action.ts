"use server"
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { Comment, NewComment } from "@/db/types";
import { revalidatePath } from "next/cache";

export const getComments = async () => {
    return db.select().from(comments);
}

export const createComment = async (comment: NewComment) => {
    await db.insert(comments).values(comment);
}

export const deleteComment = async (commentId: number) => {
    await db.delete(comments).where(eq(comments.id, commentId));
}

export const editComment = async (comment: Comment, userId: number) => {
    await db.update(comments)
        .set({
            content: comment.content,
        })
        .where(and(eq(comments.id, comment.id), eq(comments.userId, userId)))
    revalidatePath("/");
}