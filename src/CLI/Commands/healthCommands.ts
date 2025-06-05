import { databaseService } from "../../db/Database.service";
import { redisService } from "../../redis/redis.service";
import { LoggerService } from "../../utils/Logger.util";

const logger = LoggerService.getInstance();

export const HealthCommands = (program: any) => {
    program
        .command("health")
        .description("Check the health of the SentinelAPI Core")
        .action(async () => {
            try {
                const redis = await redisService.healthCheck();
                const db = await databaseService.healthCheck();

                logger.info("Health Check Results:");
                logger.info(`Redis: ${redis ? "Running" : "Not Running"}`);
                logger.info(`Database: ${db ? "Running" : "Not Running"}`);
            } catch (error) {
                logger.error(error.message);
            }
        });
};