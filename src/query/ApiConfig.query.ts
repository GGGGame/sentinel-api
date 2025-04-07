import { eq, sql } from "drizzle-orm";
import { apiConfig, ApiConfig, InsertApiConfig } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";
import { apiConfigSchema } from "../validator/models/apiConfig.validator";

class ApiConfigQuery {
    private db = databaseService.db;

    async getApiConfigById(id: number): Promise<ApiConfig> {
        const [config] = await this.db.select().from(apiConfig).where(eq(apiConfig.id, id));
        return config;
    }

    async getApiConfigsByUser(userId: number): Promise<ApiConfig> {
        const query = this.db
            .select()
            .from(apiConfig)
            .where(eq(apiConfig.userId, sql.placeholder('userId')))
            .prepare('apiConfig');

        const [config] = await query.execute({ userId });
        return config;
    }

    async createNewApiConfig(apiConfigData: InsertApiConfig): Promise<void> {
        const dataService = new MainDataService(apiConfigSchema);
        
        dataService.validate(apiConfigData);
            
        await this.db
            .insert(apiConfig)
            .values(apiConfigData)
            .onConflictDoUpdate({
                target: [apiConfig.userId],
                set: {
                    ...apiConfigData
                }
            })
    }

    async updateApiConfig(id: number, apiConfigData: InsertApiConfig): Promise<void> {
        const dataService = new MainDataService(apiConfigSchema);
        
        dataService.validate(apiConfigData);

        await this.db.update(apiConfig).set(apiConfigData).where(eq(apiConfig.id, id));
    }

    async deleteApiConfig(id: number): Promise<void> {
        await this.db.delete(apiConfig).where(eq(apiConfig.id, id));
    }

}

export const apiConfigQuery = new ApiConfigQuery();
