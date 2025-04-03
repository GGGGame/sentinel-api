import { QueryResult } from "pg";
import { InsertUser, UpdateUser, User, UserEmail } from "../db";
import { userQuery } from "../query/User.query"
import { ApiError } from "../utils/Error/ApiError";
import { passwords } from "../auth/passwords";

class userServices {

    async getAllUsers(): Promise<User[]> {
        const users = await userQuery.getAllUsers();
        return users;
    }

    async getUserById(id: number): Promise<User> {
        const user = await userQuery.findById(id);
        if (!user) {
            throw new ApiError(404, `UserId: ${id} not found`);
        }

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await userQuery.findByEmail(email);
        if (!user) {
            throw new ApiError(404, `Email: ${email} not found`);
        }

        return user as User;
    }

    async createUser(userData: InsertUser): Promise<void> {
        const user = await userQuery.findByEmail(userData.email, true);
        if (user) {
            throw new ApiError(400, 'Email already exist');
        }

        userData.password = await passwords.hashPassword(userData.password);

        await userQuery.createUser(userData);
    }

    async updateUser(id: number, userData: UpdateUser): Promise<void> {
        this.checkUserId(id)

        userData.password = await passwords.hashPassword(userData.password);

        await userQuery.updateUser(id, userData);
    }

    async deleteUser(id: number): Promise<void> {
        this.checkUserId(id)

        await userQuery.deleteUser(id);
    }

    private async checkUserId(id: number): Promise<void> {
        const user = await userQuery.findById(id);
        if (!user) {
            throw new ApiError(404, `UserId: ${id} not found`);
        }
    }
}

export const userService = new userServices();