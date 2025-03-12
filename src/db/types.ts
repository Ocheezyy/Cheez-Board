import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users, tasks, comments, files } from './schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

export type File = InferSelectModel<typeof files>;
export type NewFile = InferInsertModel<typeof files>;

export type TaskWithFiles = Task & {
    files: File[];
};