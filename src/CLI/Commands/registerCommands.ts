import { Command } from "commander";
import { UserCommands } from "./userCommands";
import { RedisCommands } from "./redisCommands";
import { RateLimitCommands } from "./rateLimitCommands";

export const registerCommands = (program: Command): void => {
    UserCommands(program);
    RedisCommands(program);
    RateLimitCommands(program);
}