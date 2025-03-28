import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cheez-board";

export async function connectToDatabase() {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(MONGODB_URI);
            console.log("Connected to MongoDB");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}