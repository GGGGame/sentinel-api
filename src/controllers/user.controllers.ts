import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";
import { LoggerService } from "../utils/Logger.util";
import { ApiError } from "../utils/Error/ApiError";
import { passwords } from "../auth/passwords";
import { jwtService } from "../auth/jwt.service";

class UserControllers {
    constructor () {
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        try {
            const user = await userService.getUserByEmail(email);
            if (!user ) {
                throw new ApiError(404, `Email: ${email} not found`);
            }

            const passwordMatch = await passwords.comparePassword(password, user.password);

            if (!passwordMatch) {
                throw new ApiError(400, 'The password is wrong, Try again.');
            }

            const token = jwtService.generateToken(user);
            
            res.json({ token });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }
    
    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.getUserById(req.user?.id);
            res.json(user);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const newUser = await userService.createUser(data);
            res.status(200).json(newUser);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const updatedUser = await userService.updateUser(req.user?.id, data);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deletedUser = await userService.deleteUser(req.user?.id);
            res.status(200).json(deletedUser);
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }
}

export const userController = new UserControllers();