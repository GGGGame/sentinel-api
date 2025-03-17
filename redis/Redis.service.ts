import Redis from "ioredis";
import { LoggerService } from "../src/utils/Logger.util";
import { env } from "../src/config/environment";

class RedisService {
    private client: Redis;
    private logger = LoggerService.getInstance();

    constructor() {
        this.client = new Redis(env.REDIS_URL)

        this.client.on('error', (error) => {
            console.error('Redis error', error);
        });
    }

    getClient(): Redis {
        return this.client;
    }

    async increment(key: string, expiry?: number): Promise<number> {
        try {
            const count = await this.client.incr(key);
            if (count === 1 && expiry) {
                await this.client.pexpire(key, expiry)
            }
            return count;
        } catch (error) {
            this.logger.error(`Error incrementing Redis key ${key} - ${error.message}`)
        }
        return 0;
    }

    async healthCheck(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            this.logger.error(`Failed redis healthcheck ${error.message}`)
            return false;
        }
    }

    async close(): Promise<void> {
        await this.client.quit();
    }
}

export const redisService = new RedisService();