import { InsertRateLimitRule, RateLimitRule, rateLimitRules } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";
import { rateLimitSchema } from "../validator/models/rateLimit.validator";

class RateLimitRulesQuery {
    private db = databaseService.db;

    async getLimitRules(): Promise<RateLimitRule[]> {
        const rules = await this.db.select().from(rateLimitRules);
        return rules;
    }

    async createLimitRule(limitRule: InsertRateLimitRule): Promise<InsertRateLimitRule> {
        const dataService = new MainDataService(rateLimitSchema);
        
        if(!dataService.validate(limitRule)) {
            return null;
        }

        const [newRule] = await this.db.insert(rateLimitRules).values(limitRule).returning();
        
        return newRule;
    }
}

export const rateLimitRulesQuery = new RateLimitRulesQuery();