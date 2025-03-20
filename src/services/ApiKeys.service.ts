import { QueryResult } from "pg";
import { ApiKey, InsertApiKey } from "../db";
import { apiKeysQuery } from "../query/ApiKeys.query";
import { ApiError } from "../utils/Error/ApiError";

class ApiKeysServices {
    
    async getAllApiKeys(): Promise<ApiKey[]> {
        const apiKeys = await apiKeysQuery.getAllApiKeys();
        return apiKeys;
    }

    async getApiKeyByUser(userId: number): Promise<ApiKey> {
        const apiKey = await apiKeysQuery.getApiKeyByUser(userId);
        if (!apiKey) {
            throw new ApiError(404, `UserId: ${userId} not found`);
        }

        return apiKey;
    }

}