import { ApiConfig, InsertApiConfig } from "../db";
import { apiConfigQuery } from "../query/ApiConfig.query";
import { ApiError } from "../utils/Error/ApiError";

class apiConfigServices {

    async getApiConfigbyUser(userId: number): Promise<ApiConfig> {
        const config = await apiConfigQuery.getApiConfigsByUser(userId);
        if (!config) {
            throw new ApiError(404, `ApiConfig for UserId: ${userId} not found`)
        }

        return config;
    }

    async createApiConfig(user_id: number, apiConfigData: InsertApiConfig): Promise<void> {
        apiConfigData.userId = user_id;

        await apiConfigQuery.createNewApiConfig(apiConfigData);
    }

    async updateApiConfig(id: number, apiConfigData: InsertApiConfig): Promise<void> {
        this.checkApiConfingById(id);

        await apiConfigQuery.updateApiConfig(id, apiConfigData);
    }

    async deleteApiConfig(id: number): Promise<void> {
        this.checkApiConfingById(id);

        await apiConfigQuery.deleteApiConfig(id);
    }

    private async checkApiConfingById(id: number): Promise<void> {
        const config = await apiConfigQuery.getApiConfigById(id);
        if (!config) {
            throw new ApiError(404, `ApiConfigId: ${id} not found`)
        }
    }
}

export const apiConfigService = new apiConfigServices();