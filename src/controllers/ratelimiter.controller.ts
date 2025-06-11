import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { InsertRateLimitRule } from "../db";

class RateLimiterController {

    async getRateLimitRules(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const rules = await rateLimitRulesService.getAllRateLimitRules();
            await res.code(200).send({
                status: 'Success',
                data: rules
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
    
    async createRateLimitRule(req: FastifyRequest<{ Body: InsertRateLimitRule}>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;
            await rateLimitRulesService.createLimitRule(data);
            await res.code(201).send({
                status: 'Success',
                data: 'Rate Limit Rule created successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const rateLimiterController = new RateLimiterController();