import { Schema, model } from 'mongoose';

export interface IFile {
    id: Schema.Types.ObjectId | string;
    url: string;
    key: string;
    name: string;
    size: number;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
}

const fileSchema = new Schema<IFile>({
    url: { type: String, required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export const File = model('File', fileSchema);