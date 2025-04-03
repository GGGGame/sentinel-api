import { QueryResult } from "pg";
import { ApiKey, InsertApiKey, UpdateApiKey } from "../db";
import { apiKeysQuery } from "../query/ApiKeys.query";
import { ApiError } from "../utils/Error/ApiError";
import { GenApiKey } from "../utils/apiKeys";

class ApiKeysServices {
    
    async getAllApiKeys(): Promise<ApiKey[]> {
        const apiKeys = await apiKeysQuery.getAllApiKeys();
        return apiKeys;
    }

    async getApiKeyById(id: string): Promise<ApiKey> {
        const apiKey = await apiKeysQuery.getApiKeyByKey(id);
        if (!apiKey) {
            throw new ApiError(404, `ApiKey: ${id} not found`);
        }

        return apiKey;
    }

    async getApiKeyByUser(userId: number): Promise<ApiKey> {
        const apiKey = await apiKeysQuery.getApiKeyByUser(userId);
        if (!apiKey) {
            throw new ApiError(404, `UserId: ${userId} not found`);
        }

        return apiKey;
    }

    async createApiKey(user_id: number, apiKeyData: InsertApiKey): Promise<void> {
        const isUnique = await apiKeysQuery.checkUniqueUserKey(apiKeyData.name, user_id);
        if (isUnique) {
            throw new ApiError(409, 'Key name already exist for the user!');
        }

        apiKeyData.key = await GenApiKey(32);
        apiKeyData.userId = user_id;

        await apiKeysQuery.createApiKey(apiKeyData);
    }

    async updatekey(id: number, user_id: number, apiKeyData: UpdateApiKey): Promise<void> {
        const isUnique = await apiKeysQuery.checkUniqueUserKey(apiKeyData.name, user_id);
        if (isUnique) {
            throw new ApiError(409, 'Key name already exist for the user!');
        }

        this.checkExistingKey(id)

        await apiKeysQuery.updateApiKey(id, apiKeyData);
    }

    async deleteApiKey(id: number): Promise<void> {
        this.checkExistingKey(id)

        await apiKeysQuery.deleteApiKey(id);
    }

    private async checkExistingKey(id: number): Promise<void> {
        const keyId = await apiKeysQuery.getApikeyById(id);
        if (!keyId) {
            throw new ApiError(404, `ApiKeyId: ${id} not found`);
        }
    }
}

export const apiKeyService = new ApiKeysServices();