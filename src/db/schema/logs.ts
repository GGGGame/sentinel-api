import { integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { apiKeys } from "./apiKeys";

export const logs = pgTable('logs', {
    id: serial('id').primaryKey(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    method: varchar('method', { length: 10 }).notNull(),
    path: text('path').notNull(),
    status: integer('status').notNull(),
    responseTime: integer('response_time').notNull(),
    ip: varchar('ip', { length: 45 }).notNull(),
    userId: integer('user_id').references(() => users.id),
    apiKeyId: integer('api_key_id').references(() => apiKeys.id),
    requestBody: json('request_body'),
    responseBody: json('response_body'),
    headers: json('headers')
  });