import {Schema, model, models} from "mongoose";

export interface IComment {
    _id: string;
    content: string;
    userId: Schema.Types.ObjectId | string;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});


export const Comment = models.Comment || model("Comment", commentSchema);