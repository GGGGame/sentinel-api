import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiConfigService } from "../services/apiConfig.service";
import { InsertApiConfig } from "../db";

class ApiConfigController {

    async getApiConfigByUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const apiConfig = await apiConfigService.getApiConfigbyUser(req.user?.id);
            await res.code(200).send({
                status: 'Success',
                data: apiConfig
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async createApiConfig(req: FastifyRequest<{ Body: InsertApiConfig }>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;
            await apiConfigService.createApiConfig(req.user.id, data);
            await res.code(200).send({
                status: 'Success',
                data: 'ApiConfig created successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async updateApiConfig(req: FastifyRequest<{ Params: { id: string }, Body: InsertApiConfig }>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            await apiConfigService.updateApiConfig(+id, data);
            await res.code(200).send({
                status: 'Success',
                data: 'ApiConfig updated successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async deleteApiConfig(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            await apiConfigService.deleteApiConfig(+id);
            await res.code(200).send({
                status: 'Success',
                data: 'ApiConfig deleted successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const apiConfigController = new ApiConfigController();