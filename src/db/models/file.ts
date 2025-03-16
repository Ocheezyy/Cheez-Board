import { Schema, model, models } from "mongoose";

export interface IFile {
    _id: string;
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
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const File = models.File || model("File", fileSchema);