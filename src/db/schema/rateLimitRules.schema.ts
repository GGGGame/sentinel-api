import { integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const typeEnum = pgEnum('type_rule', ['user', 'ip', 'endpoint', 'global']);

export const rateLimitRules = pgTable('rate_limit_rules', {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 255 }).notNull(),
    type: typeEnum('type').notNull(),
    limit: integer('limit').notNull(),
    window: integer('window').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
});