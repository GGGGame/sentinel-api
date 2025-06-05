import { users } from "./schema/users.schema";
import { apiKeys } from "./schema/apiKeys.schema";
import { logs } from "./schema/logs.schema";
import { rateLimitRules } from "./schema/rateLimitRules.schema";
import { apiConfig } from "./schema/apiConfig.schema";
import { TransformRequest, TransformResponse } from "../Interfaces/TransformerType";

export {
    users,
    apiKeys,
    logs,
    rateLimitRules,
    apiConfig
}

export type User = typeof users.$inferSelect;
export type UserEmail = Pick<typeof users.$inferSelect, "email">;
export type InsertUser = typeof users.$inferInsert;
export type UpdateUser = Omit<typeof users.$inferSelect, "id" | "createdAt" | "lastOnline">;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKeySelf = Omit<typeof apiKeys.$inferInsert, "userId" | "key">
export type InsertApiKey = typeof apiKeys.$inferInsert;
export type UpdateApiKey = Pick<typeof apiKeys.$inferSelect, "name" | "isActive" | "lastUsedAt">;

export type LogEntry = typeof logs.$inferSelect;
export type InsertLogEntry = typeof logs.$inferInsert;

export type RateLimitRule = typeof rateLimitRules.$inferSelect;
export type getLimit = Pick<typeof rateLimitRules.$inferSelect, "limit">;
export type InsertRateLimitRule = typeof rateLimitRules.$inferInsert;

export type ApiConfig = Omit<typeof apiConfig.$inferSelect, 'transformRequest' | 'transformResponse'> & {
    transformRequest?: TransformRequest,
    transformResponse?: TransformResponse
}
export type InsertApiConfig = Omit<typeof apiConfig.$inferSelect, "id" | "createdAt" | "updatedAt">;
