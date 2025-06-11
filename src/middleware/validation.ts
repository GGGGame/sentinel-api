import { FastifyRequest } from "fastify";
import { validationService } from "../services/validation.service";
import { ApiError } from "../utils/Error/ApiError";

export const validateData = async (req: FastifyRequest): Promise<void> => {
    try {
        const validateHeader = req.headers['x-sentinel-validate'] === 'true';

        if (!validateHeader) {
            return;
        }

        const allowed = await validationService.checkValidation(req.user?.id, req.url, req.method, req.body);

        if (!allowed) {
            throw new ApiError(400, "Validation failed for the request data");
        }

    } catch (error) {
        throw new ApiError(400, error.message);
    }
}