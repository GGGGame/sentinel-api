import { eq, getTableColumns } from "drizzle-orm";
import { InsertUser, User, UserEmail, users } from "../db";
import { databaseService } from "../db/Database.service"
import { MainDataService } from "../validator/main.data.service";
import { usersSchema } from "../validator/models/users.validator.model";
import { QueryResult } from "pg";

class UserQuery {
    private db = databaseService.db;

    async getAllUsers(): Promise<User[]> {
        const user = await this.db.select().from(users);
        return user;
    }
    
    async findById(id: number): Promise<User> {
        const [user] = await this.db.select().from(users).where(eq(users.id, id));
        return user;
    }

    async findByEmail(email: string, onlyEmail: boolean = false): Promise<User | UserEmail> {
        const [user] = await this.db
                        .select({
                            ...(onlyEmail 
                                ? { email: users.email } 
                                : getTableColumns(users))
                        })
                        .from(users)
                        .where(eq(users.email, email));
                        
        return onlyEmail ? user as UserEmail : user as User;
    }

    async createUser(userData: InsertUser): Promise<void> {
        const dataService = new MainDataService(usersSchema);

        dataService.validate(userData);

        await this.db.insert(users).values(userData);
    }

    async updateUser(id: number, userData: InsertUser): Promise<void> {
        const dataService = new MainDataService(usersSchema);

        dataService.validate(userData);

        await this.db.update(users).set(userData).where(eq(users.id, id));
    }

    async deleteUser(id: number): Promise<void> {
        const deletedUser = await this.db.delete(users).where(eq(users.id, id));
    }
}

export const userQuery = new UserQuery();