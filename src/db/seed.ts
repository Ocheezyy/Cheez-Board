import "dotenv/config";
import mongoose from "mongoose";
import { File, Comment, Task } from "@/db/models";

const defaultUserId: string = "user_2uNjnvCD0RFqKDV405AZQfOzZ8f";

async function seed() {
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cheeseboard";
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Task.deleteMany({});
  await Comment.deleteMany({});
  await File.deleteMany({});
  console.log("Cleared existing data");

  console.log("Seeded users");

  // Seed Tasks
  const task1 = await Task.create({
    title: "Plan Cheese Tasting Event",
    description: "Organize a cheese tasting event with at least 5 varieties.",
    priority: "high",
    status: "todo",
    userId: defaultUserId,
    dueDate: new Date(2026, 10, 20)
  });

  const task2 = await Task.create({
    title: "Buy Brie for the Party",
    description: "Purchase 3 wheels of Brie from the local cheesemonger.",
    priority: "low",
    status: "in_progress",
    userId: defaultUserId,
    dueDate: new Date(2025, 7, 1)
  });

  const task3 = await Task.create({
    title: "Create Cheese Board Layout",
    description: "Design a visually appealing cheese board layout.",
    priority: "low",
    status: "done",
    userId: defaultUserId,
    dueDate: new Date(2025, 2, 11)
  });

  console.log("Seeded tasks");

  // Seed Comments
  const comment1 = await Comment.create({
    content: "Should we include blue cheese?",
    userId: defaultUserId,
    taskId: task1._id,
  });

  const comment2 = await Comment.create({
    content: "I found a great deal on Brie at the market!",
    userId: defaultUserId,
    taskId: task2._id,
  });

  const comment3 = await Comment.create({
    content: "Love the layout! Maybe add some grapes?",
    userId: defaultUserId,
    taskId: task3._id,
  });

  console.log("Seeded comments");

  // Seed Files
  const file1 = await File.create({
    url: "https://uploadthing.com/f/12345",
    key: "file-key-12345",
    name: "cheese-board-design.png",
    size: 1024,
    userId: defaultUserId,
    taskId: task1._id,
  });

  const file2 = await File.create({
    url: "https://uploadthing.com/f/67890",
    key: "file-key-67890",
    name: "wine-list.pdf",
    size: 2048,
    userId: defaultUserId,
    taskId: task2._id,
  });

  console.log("Seeded files");

  // Link comments and files to tasks
  await Task.updateOne({ _id: task1._id }, { $push: { comments: comment1._id, files: file1._id } });
  await Task.updateOne({ _id: task2._id }, { $push: { comments: comment2._id, files: file2._id } });
  await Task.updateOne({ _id: task3._id }, { $push: { comments: comment3._id } });

  console.log("Linked comments and files to tasks");

  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
});