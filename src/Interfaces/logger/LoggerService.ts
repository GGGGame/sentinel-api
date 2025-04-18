import { LogLevel } from "../../enums/LogLevel.enum";

export interface ILoggerService {
    log(level: LogLevel, message: string, args?: any[]): void;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
}