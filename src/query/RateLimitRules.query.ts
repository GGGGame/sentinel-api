import { InsertRateLimitRule, RateLimitRule, rateLimitRules } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";
import { rateLimitSchema } from "../validator/models/rateLimit.validator.model";

class RateLimitRulesQuery {
    private db = databaseService.db;

    async getLimitRules(): Promise<RateLimitRule[]> {
        const rules = await this.db.select().from(rateLimitRules);
        return rules;
    }

    async createLimitRule(limitRule: InsertRateLimitRule): Promise<void> {
        const dataService = new MainDataService(rateLimitSchema);
        
        dataService.validate(limitRule);

        await this.db.insert(rateLimitRules).values(limitRule).returning();
    }
}

export const rateLimitRulesQuery = new RateLimitRulesQuery();