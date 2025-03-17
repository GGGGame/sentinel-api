import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/environment";
import * as schema from "./index"
import { LoggerService } from "../utils/Logger.util";

class DatabaseService {
    private pool: Pool;
    public db: ReturnType<typeof drizzle>;
    private logger = LoggerService.getInstance();


    constructor() {
        this.pool = new Pool({
            connectionString: env.DATABASE_URL
        });

        this.db = drizzle(this.pool, { schema });
    }

    async healthCheck(): Promise<boolean> {
        try {
            await this.pool.query('SELECT 1');
            return true;
        } catch (error) {
            this.logger.error(`Unable to connect to database: ${error.message}`)
            return false;
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}

export const databaseService = new DatabaseService();