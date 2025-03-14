import {Schema, model, models} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});


// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


export const User = models.User || model("User", userSchema);