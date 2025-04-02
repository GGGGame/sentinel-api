import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { InsertRateLimitRule } from "../db";

class RateLimiterController {
    
    async createRateLimitRule(req: FastifyRequest<{ Body: InsertRateLimitRule}>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;
            const newRule = await rateLimitRulesService.createLimitRule(data);
            res.code(200).send(newRule);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const rateLimiterController = new RateLimiterController();