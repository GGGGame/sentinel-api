import { eq } from "drizzle-orm";
import { InsertValidation, UpdateValidation, Validation, validation } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";
import { validationSchema } from "../validator/models/Validation.validator.model";

class ValidationQuery {
    private db = databaseService.db;

    async getValidations(): Promise<Validation[]> {
        const validations = await this.db.select().from(validation);
        return validations;
    }

    async getValidationById(id: number): Promise<Validation> {
        const [validate] = await this.db.select().from(validation).where(eq(validation.id, id));
        return validate;
    }

    async getValidationsByUser(userId: number): Promise<Validation[]> {
        const validations = await this.db.select().from(validation).where(eq(validation.userId, userId));
        return validations;
    }

    async createValidation(validationData: Validation): Promise<void> {
        const dataService = new MainDataService(validationSchema);

        dataService.validate(validationData);

        await this.db.insert(validation).values(validationData).returning();
    }

    async updateValidation(id: number, validationData: UpdateValidation): Promise<void> {
        const dataService = new MainDataService(validationSchema);

        dataService.validate(validationData);

        await this.db.update(validation).set(validationData).where(eq(validation.id, id));
    }

    async deleteValidation(id: number): Promise<void> {
        await this.db.delete(validation).where(eq(validation.id, id));
    }
}

export const validationQuery = new ValidationQuery();