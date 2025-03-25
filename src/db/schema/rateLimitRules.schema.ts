import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const rateLimitRules = pgTable('rate_limit_rules', {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 255 }).notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    limit: integer('limit').notNull(),
    window: integer('window').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
  });