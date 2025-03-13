import { users } from "./schema/users";
import { apiKeys } from "./schema/apiKeys";
import { logs } from "./schema/logs";
import { rateLimitRules } from "./schema/rateLimitRules";

export {
    users,
    apiKeys,
    logs,
    rateLimitRules
}

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

export type LogEntry = typeof logs.$inferSelect;
export type InsertLogEntry = typeof logs.$inferInsert;

export type RateLimitRule = typeof rateLimitRules.$inferSelect;
export type InsertRateLimitRule = typeof rateLimitRules.$inferInsert;