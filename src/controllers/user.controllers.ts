import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";
import { LoggerService } from "../utils/Logger.util";

class UserControllers {
    private logger = LoggerService.getInstance();

    constructor () {
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
    }
    
    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(+id);
            res.json(user);
        } catch (error) {
            this.logger.error(`Unexpected error by recovering the user ${error.message}`);
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const newUser = await userService.createUser(data);
            res.status(200).json(newUser);
        } catch (error) {
            this.logger.error(`Unexpected error by creating the user`);
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedUser = await userService.updateUser(+id, data);
            res.status(200).json(updatedUser);
        } catch (error) {
            this.logger.error(`Unexpected error by updating the user`);
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deletedUser = await userService.deleteUser(+id);
            res.status(200).json(deletedUser);
        } catch (error) {
            this.logger.error(`Unexpected error by deleting the user`);
            next(error);
        }
    }
}

export const userController = new UserControllers();