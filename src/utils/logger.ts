import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ILoggerService } from "../Interfaces/logger/LoggerService";
import { LogLevel } from "../enums/LogLevelEnum";

export class LoggerService implements ILoggerService {
    private static instance: LoggerService;
    private logger: winston.Logger;

    private constructor() {
        const transport = new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            maxSize: '20m',
            zippedArchive: false,
            options: { flags: 'a' }
        });

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.printf(
                    ({ timestamp, level, message }) => 
                    `[${timestamp}] ${level.toUpperCase()}: ${message}`)
            ),
            transports: [
                new winston.transports.Console(),
                transport
            ]
        });
    }

    public static getInstance(): LoggerService {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }

    // general centralized log where is possible to add 
    public log(level: LogLevel, message: string, args?: any): void {
        this.logger.log(level, message);

        // additional code for @args & debug levels
    }

    public error(message: string): void {
        this.log(LogLevel.ERROR, message);
    }

    public warn(message: string): void {
        this.log(LogLevel.WARN, message);
    }

    public info(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    public debug(message: string): void {
        this.log(LogLevel.DEBUG, message);
    }
}