import { and, eq, sql } from "drizzle-orm";
import { ApiKey, apiKeys, InsertApiKey, UpdateApiKey } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";
import { apiKeysSchema } from "../validator/models/apiKeys.validator.model";
import { QueryResult } from "pg";
import { updateApiKeysSchema } from "../validator/models/updateApiKeys.validator.model";

class ApiKeysQuery {
    private db = databaseService.db;

    // must not be used in production
    async getAllApiKeys(): Promise<ApiKey[]> {
        const apiKey = await this.db.select().from(apiKeys);
        return apiKey;
    }

    async getApikeyById(id: number): Promise<ApiKey> {
        const [apiKey] = await this.db.select().from(apiKeys).where(eq(apiKeys.id, id));
        return apiKey;
    }

    async getApiKeyByUser(userId: number): Promise<ApiKey> {
        const [apiKey] = await this.db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
        return apiKey;
    }

    async getApiKeyByKey(key: string): Promise<ApiKey> {
        const query = this.db
            .select()
            .from(apiKeys)
            .where(eq(apiKeys.key, sql.placeholder('key')))
            .prepare("apiKey");

        const [apikey] = await query.execute({ key });
        return apikey;
    }

    async createApiKey(apiKeyData: InsertApiKey): Promise<void> {
        const dataService = new MainDataService(apiKeysSchema);

        dataService.validate(apiKeyData);

        await this.db.insert(apiKeys).values(apiKeyData).returning();
    
    }

    async updateApiKey(id: number, apiKeyData: UpdateApiKey): Promise<void> {
        const dataService = new MainDataService(updateApiKeysSchema);

        dataService.validate(apiKeyData);

        await this.db.update(apiKeys).set(apiKeyData).where(eq(apiKeys.id, id));
    }

    async deleteApiKey(id: number): Promise<void> {
        await this.db.delete(apiKeys).where(eq(apiKeys.id, id));
    }

    async checkUniqueUserKey(name: string, user_id: number): Promise<boolean> {
        const exist = await this.db.select()
                                .from(apiKeys)
                                .where(
                                    and(
                                        eq(apiKeys.name, name),
                                        eq(apiKeys.userId, user_id)
                                    )
                                );
        if (exist.length >= 1) {
            return true;
        }
        return false;
        
    }
}

export const apiKeysQuery = new ApiKeysQuery();