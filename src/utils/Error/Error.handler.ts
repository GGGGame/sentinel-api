import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "./ApiError";
import { LoggerService } from "../Logger.util";
import { RedisError } from "./RedisError";

export const errorHandler = (
    err: Error | ApiError | RedisError,
    req: FastifyRequest,
    res: FastifyReply,
): void => {
    let statusCode = 500;
    let message = 'default error message';

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        message = err.message;
    }

    const logger = LoggerService.getInstance();

    logger.error(`
        code: ${statusCode}
        context: ${message}
        path: ${req.url}
        method: ${req.method}
        error: ${err.stack || err}   
    `);    

    res.code(statusCode).send({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}