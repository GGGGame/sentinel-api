import { Command } from "commander";
import { LoggerService } from "../../utils/Logger.util";

const logger = LoggerService.getInstance();

export const ApiKey = (program: Command) => {

    program
        .command("api-key")
        .description("Manage API keys")
        .action(() => {
            logger.info("API Key management is not implemented yet.");
            // Here you can add subcommands for creating, deleting, or listing API keys
        });
}