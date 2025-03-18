import { QueryResult } from "pg";
import { InsertUser, UpdateUser, User } from "../db";
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

    async createUser(userData: InsertUser): Promise<QueryResult> {
        const user = await userQuery.findByEmail(userData.email);
        if (user) {
            throw new ApiError(400, 'Email already exist');
        }

        passwords.hashPassword(userData.password);

        const newUser = await userQuery.createUser(userData);
        return newUser;
    }

    async updateUser(id: number, userData: UpdateUser): Promise<QueryResult> {
        if (!this.checkUserId(id)) {
            return null;
        }

        userData.password = await passwords.hashPassword(userData.password);
        userData.updatedAt = new Date();

        const updatedUser = await userQuery.updateUser(id, userData);
        return updatedUser;
    }

    async deleteUser(id: number): Promise<QueryResult> {
        if (!this.checkUserId(id)) {
            return null;
        }

        const deletedUser = await userQuery.deleteUser(id);
        return deletedUser;
    }

    private async checkUserId(id: number): Promise<boolean> {
        const user = await userQuery.findById(id);
        if (!user) {
            throw new ApiError(404, `UserId: ${id} not found`);
        }
 
        return true;
    }
}

export const userService = new userServices();