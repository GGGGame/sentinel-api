import { boolean, integer, jsonb, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const apiConfig = pgTable('api_config', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id).unique(),
    transformRequest: jsonb('transform_request').default({}),
    transformResponse: jsonb('transform_response').default({}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});