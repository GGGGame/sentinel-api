import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const apiKeys = pgTable('api_keys', {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 64 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    userId: integer('user_id').notNull().references(() => users.id),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at')
  });