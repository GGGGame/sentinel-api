
import { Command } from "commander";
import { LoggerService } from "../../utils/Logger.util";
import { InsertRateLimitRule } from "../../db";
import { rateLimitRulesService } from "../../services/ratelimitrules.service";


const logger = LoggerService.getInstance();

export const RateLimitCommands = (program: Command) => {

    program
        .command("create-rate-limit-rule")
        .description("Create a new rate limit rule")
        .requiredOption('-k, --key <key>', 'Key for the rate limit rule')
        .requiredOption('-t, --type <type>', 'Type of the rate limit rule')
        .requiredOption('-l, --limit <limit>', 'Limit for the rate limit rule')
        .requiredOption('-w, --window <window>', 'Window in seconds for the rate limit rule')
        .action(async (rateLimitRule: InsertRateLimitRule) => {
            await rateLimitRulesService.createLimitRule(rateLimitRule);

            logger.info(`Rate Limit Rule created: Key: ${rateLimitRule.key}, Type: ${rateLimitRule.type}, Limit: ${rateLimitRule.limit}, Window: ${rateLimitRule.window}`);
        });

}