import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";

class RateLimiterController {
    
    async createRateLimitRule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const newRule = await rateLimitRulesService.createLimitRule(data);
            res.status(200).json(newRule);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }
}

export const rateLimiterController = new RateLimiterController();