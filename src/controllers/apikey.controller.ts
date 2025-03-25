import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/Error/ApiError";
import { apiKeyService } from "../services/apikey.service";

class ApiKeyController {
    
    async getApiKeysByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const keys = await apiKeyService.getApiKeyByUser(req.user?.id);
            res.json(keys);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    async createApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const newApiKey = await apiKeyService.createApiKey(req.user?.id, data);
            res.status(200).json(newApiKey);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    async updateApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedApiKey = await apiKeyService.updatekey(+id, req.user?.id, data);
            res.status(200).json(updatedApiKey);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    async deleteApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deletedApiKey = await apiKeyService.deleteApiKey(+id);
            res.status(200).json(deletedApiKey);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }
}

export const apiKeyController = new ApiKeyController();