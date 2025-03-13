import {Schema, model, models} from 'mongoose';
import { IComment } from "./comment";
import { IFile } from "./file";

export interface ITask {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    userId: Schema.Types.ObjectId | string;
    comments: string[];
    files: string[];
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITaskPopulated {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    userId: Schema.Types.ObjectId | string;
    files: IFile[];
    comments: IComment[];
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true, enum: ['todo', 'in_progress', 'done'] },
    priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // Nested comments
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }], // Nested files
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Task = models.Task || model('Task', taskSchema);