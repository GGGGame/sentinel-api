import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { InsertValidation, UpdateValidation } from "../db";
import { validationServices } from "../services/validation.service";

class ValidationController {

    async getValidationsByUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const validations = await validationServices.getValidationsByUser(req.user.id);
            await res.code(200).send({
                status: 'Success',
                data: validations
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async createValidation(req: FastifyRequest<{ Body: InsertValidation }>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;

            await validationServices.createValidation(req.user.id, data);
            await res.code(201).send({
                status: 'Success',
                message: 'Validation created successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async updateValidation(req: FastifyRequest<{ Params: { id: string }, Body: UpdateValidation }>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            await validationServices.updateValidation(+id, data);
            await res.code(200).send({
                status: 'Success',
                data: "Validation updated successfully"
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async deleteValidation(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params;
            await validationServices.deleteValidation(+id);
            await res.code(200).send({
                status: 'Success',
                data: 'Validation deleted successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const validationController = new ValidationController();