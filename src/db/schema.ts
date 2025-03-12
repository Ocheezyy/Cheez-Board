import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull(), // e.g., 'todo', 'in_progress', 'done'
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  taskId: serial('task_id').references(() => tasks.id),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  key: text('key').notNull(), // The unique key for the file in UploadThing
  name: text('name').notNull(),
  size: integer('size').notNull(), // bytes
  taskId: integer('task_id').references(() => tasks.id), // Link to the task
  userId: integer('user_id').references(() => users.id), // Link to the user who uploaded the file
  createdAt: timestamp('created_at').defaultNow(),
});