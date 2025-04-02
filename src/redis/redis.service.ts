import Redis from "ioredis";
import { env } from "../config/environment";
import { RedisError } from "../utils/Error/RedisError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { LoggerService } from "../utils/Logger.util";
class RedisService {
    private client: Redis;
    private isInitialized: boolean = false;
    private logger = LoggerService.getInstance();

    constructor() {
        this.client = new Redis(env.REDIS_URL)

        this.client.on('error', (error) => {
            console.error('Redis error', error);
        });
    }

    async initializeRules(): Promise<void> {
        if (this.isInitialized) return;

        await rateLimitRulesService.setLimitRules();
        this.isInitialized = true;
        this.logger.info("Rate limit initialized!");
    }

    getClient(): Redis {
        return this.client;
    }

    async set(key: string, value: string, expiry?: number): Promise<void> {
        try {
            await this.client.set(key, value);
            if (expiry) {
                await this.client.pexpire(key, expiry)
            }
        } catch (error) {
            throw new RedisError(500, `Error setting Redis key ${key} - ${error.message}`)
        }
    }
    
    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            throw new RedisError(500, `Error getting Redis key ${key} - ${error.message}`)
        }
    }

    async increment(key: string, expiry?: number): Promise<number> {
        try {
            const count = await this.client.incr(key);
            // To use just in case of not using the TTL
            if (count === 1 && expiry) {
                await this.client.pexpire(key, expiry)
            }
            return count;
        } catch (error) {
            throw new RedisError(500, `Error incrementing Redis key ${key} - ${error.message}`)
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            throw new RedisError(500, `Failed redis healthcheck ${error.message}`)
        }
    }

    async close(): Promise<void> {
        await this.client.quit();
    }
}

export const redisService = new RedisService();