import { getLimit, InsertRateLimitRule, RateLimitRule } from "../db";
import { rateLimitRulesQuery } from "../query/RateLimitRules.query";
import { redisService } from "../redis/redis.service";

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
        const countKey = `rate-limit:${key}:${type}:count`;
        const limitKey = `rate-limit:${key}:${type}:limit`;

        const limit = parseInt(await redisService.get(limitKey)) || 0;

        const currentKeyUsage = await redisService.increment(countKey);

        return currentKeyUsage <= limit;
    }

    async createLimitRule(limitRule: InsertRateLimitRule): Promise<InsertRateLimitRule> {
        const newRule = await rateLimitRulesQuery.createLimitRule(limitRule);
        await this.setLimitRules();

        return newRule;
    }
}

export const rateLimitRulesService = new RateLimitRules();