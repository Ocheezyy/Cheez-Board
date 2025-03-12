import 'dotenv/config';
import { db } from './index';
import { users, tasks, comments } from './schema';

async function seed() {
  // Seed Users
  const userData = [
    { name: 'Gouda Guy', email: 'gouda.guy@cheeseboard.com', password: 'hashed_password_1' },
    { name: 'Brie Boss', email: 'brie.boss@cheeseboard.com', password: 'hashed_password_2' },
    { name: 'Cheddar Chief', email: 'cheddar.chief@cheeseboard.com', password: 'hashed_password_3' },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();

  // Seed Tasks
  const taskData = [
    { title: 'Plan Cheese Tasting Event', description: 'Organize a cheese tasting event with at least 5 varieties.', status: 'todo', userId: insertedUsers[0].id },
    { title: 'Buy Brie for the Party', description: 'Purchase 3 wheels of Brie from the local cheesemonger.', status: 'in_progress', userId: insertedUsers[1].id },
    { title: 'Create Cheese Board Layout', description: 'Design a visually appealing cheese board layout.', status: 'done', userId: insertedUsers[2].id },
    { title: 'Order Crackers and Wine', description: 'Get assorted crackers and pair them with wine.', status: 'todo', userId: insertedUsers[0].id },
  ];

  const insertedTasks = await db.insert(tasks).values(taskData).returning();

  // Seed Comments
  const commentData = [
    { content: 'Should we include blue cheese?', taskId: insertedTasks[0].id, userId: insertedUsers[1].id },
    { content: 'I found a great deal on Brie at the market!', taskId: insertedTasks[1].id, userId: insertedUsers[2].id },
    { content: 'Love the layout! Maybe add some grapes?', taskId: insertedTasks[2].id, userId: insertedUsers[0].id },
  ];

  await db.insert(comments).values(commentData);

  console.log('Database seeded successfully!');
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
});