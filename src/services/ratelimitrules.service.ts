import { getLimit, InsertRateLimitRule, RateLimitRule } from "../db";
import { rateLimitRulesQuery } from "../query/RateLimitRules.query";
import { redisService } from "../redis/redis.service";
import { RedisError } from "../utils/Error/RedisError";

class RateLimitRules {

    async setLimitRules(): Promise<void> {
        const rules = await rateLimitRulesQuery.getLimitRules();
        for (const rule of rules) {
            const key = `rate-limit:${rule.key}:${rule.type}`;

            await redisService.set(`${key}:count`, '0', rule.window * 1000);
            await redisService.set(`${key}:limit`, rule.limit.toString());
        }
    }

    async checkLimit(key: string | number, type: string): Promise<boolean> {
        const limitKey = `rate-limit:${key}:${type}:limit`;
        const limit = await redisService.get(limitKey);

        if (limit === null) {
            throw new RedisError(400, `Cannot found Key: ${key} and Type: ${type} in Redis`);
        }

        const countKey = `rate-limit:${key}:${type}:count`;
        const currentKeyUsage = await redisService.increment(countKey);

        return currentKeyUsage <= parseInt(limit);
    }

    async createLimitRule(limitRule: InsertRateLimitRule): Promise<InsertRateLimitRule> {
        const newRule = await rateLimitRulesQuery.createLimitRule(limitRule);
        await this.setLimitRules();

        return newRule;
    }
}

export const rateLimitRulesService = new RateLimitRules();