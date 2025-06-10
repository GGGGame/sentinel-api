import { eq } from "drizzle-orm";
import { Validation, validation } from "../db";
import { databaseService } from "../db/Database.service";
import { MainDataService } from "../validator/main.data.service";

class ValidationQuery {
    private db = databaseService.db;

    async getValidationById(id: number): Promise<Validation> {
        const [validate] = await this.db.select().from(validation).where(eq(validation.id, id));
        return validate;
    }

    // async createValidation(validationData: Validation): Promise<void> {
    //     const dataService = new MainDataService(validationSchema);

    //     dataService.validate(validationData);

    //     await this.db.insert(validation).values(validationData).returning();
    // }  
}