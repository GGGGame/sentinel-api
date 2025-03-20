import { eq } from "drizzle-orm";
import { ApiKey, apiKeys, InsertApiKey } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";
import { apiKeysSchema } from "../validator/models/apiKeys.validator.model";
import { QueryResult } from "pg";

class ApiKeysQuery {
    private db = databaseService.db;

    // must not be used in production
    async getAllApiKeys(): Promise<ApiKey[]> {
        const apiKey = await this.db.select().from(apiKeys);
        return apiKey;
    }

    async getApiKeyByUser(userId: number): Promise<ApiKey> {
        const [apiKey] = await this.db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
        return apiKey;
    }

    async createApiKey(apiKeyData: InsertApiKey): Promise<QueryResult> {
        const dataService = new MainDataService(apiKeysSchema);

        if(!dataService.validate(apiKeyData)) {
            return null;
        }

        const newApiKey = await this.db.insert(apiKeys).values(apiKeyData);
        
        return newApiKey;
    }

    async updateApiKey(id: number, apiKeyData: InsertApiKey): Promise<QueryResult> {
        const dataService = new MainDataService(apiKeysSchema);

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
}

export const apiKeysQuery = new ApiKeysQuery();