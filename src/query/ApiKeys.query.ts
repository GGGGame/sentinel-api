import { and, eq } from "drizzle-orm";
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
        const [apiKey] = await this.db.select().from(apiKeys).where(eq(apiKeys.key, key));
        return apiKey;
    }

    async validate(apiKeyData: InsertApiKey): Promise<boolean> {
        const dataService = new MainDataService(apiKeysSchema);

        if(!dataService.validate(apiKeyData)) {
            return false;
        }
        return true;
    }

    async createApiKey(apiKeyData: InsertApiKey): Promise<ApiKey> {
        const dataService = new MainDataService(apiKeysSchema);

        if(!dataService.validate(apiKeyData)) {
            return null;
        }

        const [newApiKey] = await this.db.insert(apiKeys).values(apiKeyData).returning();
        
        return newApiKey;
    }

    async updateApiKey(id: number, apiKeyData: UpdateApiKey): Promise<QueryResult> {
        const dataService = new MainDataService(updateApiKeysSchema);

        if(!dataService.validate(apiKeyData)) {
            return null;
        }

        const updatedApiKey = await this.db.update(apiKeys).set(apiKeyData).where(eq(apiKeys.id, id));

        return updatedApiKey;
    }

    async deleteApiKey(id: number): Promise<QueryResult> {
        const deletedApiKey = await this.db.delete(apiKeys).where(eq(apiKeys.id, id));
        
        return deletedApiKey;
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