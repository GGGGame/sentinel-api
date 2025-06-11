import { InsertValidation, UpdateValidation, Validation } from "../db";
import { validationQuery } from "../query/Validation.query";
import { redisService } from "../redis/redis.service";
import { ApiError } from "../utils/Error/ApiError";
import { MainDataService } from "../validator/main.data.service";

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

        const key = `validation:${validation.userId}:${validation.route}:${validation.method}`;
        const schema = JSON.stringify(validation.schema);
        await redisService.set(key, schema);
    }

    async updateValidation(id: number, validationData: UpdateValidation): Promise<void> {
        await this.checkValidationById(id);
        await validationQuery.updateValidation(id, validationData);

        const validation = await this.getValidationById(id);
        if (validation) {
            const key = `validation:${validation.userId}:${validation.route}:${validation.method}`;
            const schema = JSON.stringify(validation.schema);
            await redisService.set(key, schema);
        }
    }

    async deleteValidation(id: number): Promise<void> {
        await this.checkValidationById(id);
        await validationQuery.deleteValidation(id);

        const validation = await this.getValidationById(id);
        if (validation) {
            const key = `validation:${validation.userId}:${validation.route}:${validation.method}`;
            await redisService.del(key);
        }
    }

    async checkValidation(userId: number, route: string, method: string, body: any): Promise<boolean> {
        const validationKey = `validation:${userId}:${route}:${method}`;
        const validationSchema = await redisService.get(validationKey);
        if (validationSchema === null) {
            throw new ApiError(400, `Validation for UserId: ${userId}, Route: ${route}, Method: ${method} not found in Redis`);
        }
        const schema = JSON.parse(validationSchema);
        const dataService = new MainDataService(schema);

        dataService.validate(body);

        return true;
    }

    private async checkValidationById(id: number): Promise<void> {
        const validation = await validationQuery.getValidationById(id);
        if (!validation) {
            throw new ApiError(404, `Validation with ID: ${id} not found`);
        }
    }
}

export const validationServices = new ValidationServices();