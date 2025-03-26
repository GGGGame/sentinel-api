import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { key, type } = await getKeyAndType(req);

    try {
        await rateLimitRulesService.setLimitRules();
    } catch (error) {
        next(new ApiError(400, error.message));
    }
}

const getKeyAndType = async (req: Request): Promise<{ key: string | number, type: string }> => {
    if (req.user) return { key: req.user.id, type: "user" };
    if (req.path) return { key: req.path, type: "path" };
    return { key: req.ip, type: "ip" };
}