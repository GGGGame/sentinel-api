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

    async validateData(apiKeyData: InsertApiKey): Promise<boolean> {
        const validate = await apiKeysQuery.validate(apiKeyData);
        
        if (!validate) {
            // throw new ApiError(400, 'Error data validation');
            return false;
        }

        return true;
    }

    async createApiKey(user_id: number, apiKeyData: InsertApiKey): Promise<ApiKey> {
        const isUnique = await apiKeysQuery.checkUniqueUserKey(apiKeyData.name, user_id);
        if (isUnique) {
            throw new ApiError(409, 'Key name already exist for the user!');
        }

        apiKeyData.key = await GenApiKey(32);
        apiKeyData.userId = user_id;

        const newApiKey = await apiKeysQuery.createApiKey(apiKeyData);
        return newApiKey;
    }

    async updatekey(id: number, user_id: number, apiKeyData: UpdateApiKey): Promise<QueryResult> {
        const isUnique = await apiKeysQuery.checkUniqueUserKey(apiKeyData.name, user_id);
        if (isUnique) {
            throw new ApiError(409, 'Key name already exist for the user!');
        }

        if (!this.checkExistingKey(id)) {
            return null;
        }

        const updatedApiKey = await apiKeysQuery.updateApiKey(id, apiKeyData);
        return updatedApiKey;
    }

    async deleteApiKey(id: number): Promise<QueryResult> {
        if (!this.checkExistingKey(id)) {
            return null;
        }

        const deletedApiKey = await apiKeysQuery.deleteApiKey(id);
        return deletedApiKey;
    }

    private async checkExistingKey(id: number): Promise<boolean> {
        const keyId = await apiKeysQuery.getApikeyById(id);
        if (!keyId) {
            throw new ApiError(404, `ApiKeyId: ${id} not found`);
        }

        return true;
    }
}

export const apiKeyService = new ApiKeysServices();