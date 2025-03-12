import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true, enum: ['todo', 'in_progress', 'done'] },
    priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Nested comments
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], // Nested files
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Task = mongoose.model('Task', taskSchema);