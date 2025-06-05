import { ApiError } from "../utils/Error/ApiError";
import { apiKeyService } from "../services/apikey.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { InsertApiKey, InsertApiKeySelf, UpdateApiKey } from "../db";

class ApiKeyController {
    
    async getApiKeysByUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const keys = await apiKeyService.getApiKeyByUser(req.user?.id);
            await res.send({
                status: 'Success',
                data: keys
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async createApiKey(req: FastifyRequest<{ Body: InsertApiKeySelf }>, res: FastifyReply): Promise<void> {
        try {
            const data: InsertApiKeySelf = req.body;
            await apiKeyService.createApiKey(req.user?.id, data);

            await res.code(200).send({
                status: 'Success',
                data: 'ApiKey created successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async updateApiKey(req: FastifyRequest<{ Params: { id: string }, Body: UpdateApiKey}>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            await apiKeyService.updatekey(+id, req.user?.id, data);
            await res.code(200).send({
                status: 'Success',
                data: 'ApiKey updated successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async deleteApiKey(req: FastifyRequest<{ Params: { id: string }}>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            await apiKeyService.deleteApiKey(+id);
            await res.code(200).send({
                status: 'Success',
                data: 'ApiKey deleted successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const apiKeyController = new ApiKeyController();