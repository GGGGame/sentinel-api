import { Command } from "commander";
import { LoggerService } from "../../utils/Logger.util";
import { redisService } from "../../redis/redis.service";

const logger = LoggerService.getInstance();

export const RedisCommands = (program: Command) => {

   //#region Redis Health Check

    program
        .command("redis")
        .description("Check if Redis is running")
        .action(async () => {
            const keys = await redisService.keys("*");
            if (keys.length === 0) {
                logger.info("No keys found in Redis.");
                return;
            }
            logger.info(`Found ${keys.length} keys:`);
            for (const key of keys) {
                const value = await redisService.get(key);
                logger.info(`${key}: ${value}`);
            }
        });

    //#endregion

};