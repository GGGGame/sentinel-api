import { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError";
import { LoggerService } from "../logger";

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
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
        code: ${statusCode} \t
        context: ${message} \t
        path: ${req.path}   \t
        method: ${req.method} \t
        error: ${err}        \t   
    `);

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}