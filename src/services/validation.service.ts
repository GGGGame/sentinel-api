import { InsertValidation, UpdateValidation, Validation } from "../db";
import { validationQuery } from "../query/Validation.query";
import { ApiError } from "../utils/Error/ApiError";

class ValidationServices {

    async getValidationById(id: number): Promise<Validation> {
        const validation = await validationQuery.getValidationById(id);
        if (!validation) {
            throw new ApiError(404, `Validation with ID: ${id} not found`);
        }
        return validation;
    }

    async getValidationsByUser(userId: number): Promise<Validation[]> {
        const validations = await validationQuery.getValidationsByUser(userId);
        if (!validations) {
            throw new ApiError(404, `UserId: ${userId} not found`);
        }
        return validations;
    }

    async createValidation(user_id: number, validationData: InsertValidation): Promise<void> {
        const validation = validationData as Validation;

        validation.userId = user_id;

        await validationQuery.createValidation(validation);
    }

    async updateValidation(id: number, validationData: UpdateValidation): Promise<void> {
        await this.checkValidationById(id);
        await validationQuery.updateValidation(id, validationData);
    }

    async deleteValidation(id: number): Promise<void> {
        await this.checkValidationById(id);
        await validationQuery.deleteValidation(id);
    }

    private async checkValidationById(id: number): Promise<void> {
        const validation = await validationQuery.getValidationById(id);
        if (!validation) {
            throw new ApiError(404, `Validation with ID: ${id} not found`);
        }
    }
}

export const validationServices = new ValidationServices();