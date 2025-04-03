import { FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { rateLimitRulesService } from "../services/ratelimitrules.service";
import { RedisError } from "../utils/Error/RedisError";
import { RATE_LIMIT } from "../enums/typeRateLimit.enums";

export const rateLimiter = async (req: FastifyRequest): Promise<void> => {
    try {
        const { key, type } = await getKeyAndType(req);
        const allowed = await rateLimitRulesService.checkLimit(key, type);

        if (!allowed) {
            throw new RedisError(429, `Rate limit [key: ${key} type: ${type}] exceeded. Try again later`);
        }

    } catch (error) {
        throw new RedisError(400, error.message);
    }
}

const getKeyAndType = async (req: FastifyRequest): Promise<{ key: string | number, type: string }> => {
    const limitHeader = req.headers['x-sentinel-limit-rules'] as string;

    if (!limitHeader) {
        throw new ApiError(401, 'Missing limit-rules header');
    }

    const headerSplit = limitHeader.split(' ');
    // expected format enum: typeRateLimit.enum.ts
    if (headerSplit.length !== 1 && headerSplit[0] in RATE_LIMIT) {
        throw new ApiError(401, `Requested wrong format of limit-rules, required: ${RATE_LIMIT}`);
    }

    return selectByRule(req, headerSplit[0]);
}

const selectByRule = async (req: FastifyRequest, header: string): Promise<{ key: string | number, type: string }> => {
    switch (header) {
        case "ip":
            return { key: req.ip, type: header};
        case "user":
            return { key: req.user?.id, type: header};
        case "path":
            return { key: req.url, type: header};
        case "global":
            return { key: header, type: header};
        default:
            throw new ApiError(401, `Invalid header: ${header}`);
    }
}