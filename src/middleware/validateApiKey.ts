import { FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiKeyService } from "../services/apikey.service";
import { redisService } from "../redis/redis.service";

export const validateApiKey = async (req: FastifyRequest) => {
    try {
        const apiKey = req.headers["x-sentinel-api-key"] as string;

        if (!apiKey) {
            throw new ApiError(401, "Missing API key");
        }
    
        if (apiKey.split(' ').length !== 1) {
            throw new ApiError(401, "Invalid API key format");
        }

        const cacheKey = `api-key:${apiKey}`;
        let keyData = await redisService.get(cacheKey);
        
        // avoid new query, recover the already fetched data directly by redis
        if (!keyData) {
            const key = await apiKeyService.getApiKeyById(apiKey);
            if (!key) {
                throw new ApiError(401, "Invalid API key");
            }
        
            if (!key.isActive) {
                throw new ApiError(401, "API key is not active");
            }
        
            if (key.userId !== req.user?.id) {
                throw new ApiError(403, "You are not the owner of this Key");
            }

            keyData = JSON.stringify({
                userId: key.userId,
                isActive: key.isActive
            });
            //set expiration key in 5 mins, run another query
            await redisService.set(cacheKey, keyData, 300 * 1000);
        }

        const { userId, isActive } = JSON.parse(keyData);

        if (!isActive) {
            throw new ApiError(401, "API key is not active");
        }
    
        if (userId !== req.user?.id) {
            throw new ApiError(403, "You are not the owner of this Key");
        }


    } catch (error) {
        throw new ApiError(400, error.message);
    }
}