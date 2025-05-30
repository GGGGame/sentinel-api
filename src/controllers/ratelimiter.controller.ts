import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { InsertRateLimitRule } from "../db";

class RateLimiterController {
    
    async createRateLimitRule(req: FastifyRequest<{ Body: InsertRateLimitRule}>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;
            rateLimitRulesService.createLimitRule(data);
            await res.code(200).send({
                status: 'Success',
                data: 'Rate Limit Rule created successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const rateLimiterController = new RateLimiterController();