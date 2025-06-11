import Redis from "ioredis";
import { env } from "../config/environment";
import { RedisError } from "../utils/Error/RedisError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { LoggerService } from "../utils/Logger.util";
import { validationService } from "../services/validation.service";
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
        await validationService.setValidation();
        this.isInitialized = true;
        this.logger.info("Rate limit initialized!");
    }

    getClient(): Redis {
        return this.client;
    }

    async keys(pattern: string): Promise<string[]> {
        try {
            return await this.client.keys(pattern);
        } catch (error) {
            throw new RedisError(500, `Error fetching keys with pattern ${pattern} - ${error.message}`)
        }
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

    async del(key: string): Promise<void> {
        try {
            const result = await this.client.del(key);
            if (result === 0) {
                throw new RedisError(404, `Key ${key} not found in Redis`);
            }
        } catch (error) {
            if (error instanceof RedisError) {
                throw error; // Re-throw custom RedisError
            }
            throw new RedisError(500, `Error deleting Redis key ${key} - ${error.message}`);
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