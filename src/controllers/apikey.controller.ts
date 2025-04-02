import { ApiError } from "../utils/Error/ApiError";
import { apiKeyService } from "../services/apikey.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { InsertApiKey, UpdateApiKey } from "../db";

class ApiKeyController {
    
    async getApiKeysByUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const keys = await apiKeyService.getApiKeyByUser(req.user?.id);
            res.send(keys);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async createApiKey(req: FastifyRequest<{ Body: InsertApiKey }>, res: FastifyReply): Promise<void> {
        try {
            const data: InsertApiKey = req.body;
            const newApiKey = await apiKeyService.createApiKey(req.user?.id, data);
            res.code(200).send(newApiKey);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async basicResponse(req: FastifyRequest<{ Body: InsertApiKey }>, res: FastifyReply): Promise<void> {
        try {
            if (!apiKeyService.validateData(req.body)) {
                res.code(400).send({ result: 'Error data validation'});
            }
            res.code(200).send({result: 'success'});
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async updateApiKey(req: FastifyRequest<{ Params: { id: string }, Body: UpdateApiKey}>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedApiKey = await apiKeyService.updatekey(+id, req.user?.id, data);
            res.code(200).send(updatedApiKey);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async deleteApiKey(req: FastifyRequest<{ Params: { id: string }}>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            const deletedApiKey = await apiKeyService.deleteApiKey(+id);
            res.code(200).send(deletedApiKey);
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const apiKeyController = new ApiKeyController();