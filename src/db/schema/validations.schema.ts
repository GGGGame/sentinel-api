import { boolean, integer, jsonb, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

const typeEnum = pgEnum('method_type', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']);

export const validation = pgTable('validations', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    route: varchar('route').notNull(),
    method: typeEnum('type').notNull(),
    schema: jsonb('schema').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});