import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { RedisError } from "../utils/Error/RedisError";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { key, type } = await getKeyAndType(req);
        const allowed = await rateLimitRulesService.checkLimit(key, type);

        if (!allowed) {
            return next(new RedisError(429, `Rate limit [key: ${key} type: ${type}] exceeded. Try again later`));
        }

        next();
    } catch (error) {
        next(new RedisError(400, error.message));
    }
}

const getKeyAndType = async (req: Request): Promise<{ key: string | number, type: string }> => {
    if (req.user) return { key: req.user.id, type: "user" };
    if (req.path) return { key: req.path, type: "path" };
    if (req.ip) return { key: req.ip, type: "ip" };
    return { key: 'global', type: "global" };
}