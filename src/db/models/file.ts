import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export const File = mongoose.model('File', fileSchema);