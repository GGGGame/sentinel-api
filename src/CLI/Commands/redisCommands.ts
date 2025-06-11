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
            
        });

    //#endregion

};