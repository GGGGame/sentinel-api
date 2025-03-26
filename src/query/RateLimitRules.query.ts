import { RateLimitRule, rateLimitRules } from "../db";
import { databaseService } from "../db/Database.service";

class RateLimitRulesQuery {
    private db = databaseService.db;

    async getLimitRules(): Promise<RateLimitRule[]> {
        const rules = await this.db.select().from(rateLimitRules);
        return rules;        
    }
}

export const rateLimitRulesQuery = new RateLimitRulesQuery();