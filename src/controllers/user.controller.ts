
import { userService } from "../services/user.service";
import { ApiError } from "../utils/Error/ApiError";
import { passwords } from "../auth/passwords";
import { jwtService } from "../auth/jwt.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { InsertUser, UpdateUser } from "../db";

class UserControllers {

    async login(req: FastifyRequest<{ Body: { email: string, password: string }}>, res: FastifyReply): Promise<void> {
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
            
            await res.code(200).send({ token });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
    
    async getUserById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const user = await userService.getUserById(req.user?.id);
            await res.code(200).send({
                status: 'Success',
                data: user
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async createUser(req: FastifyRequest<{ Body: InsertUser}>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;
            await userService.createUser(data);
            await res.code(201).send({
                status: 'Success',
                data: 'User created successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async updateUser(req: FastifyRequest<{ Body: UpdateUser}>, res: FastifyReply): Promise<void> {
        try {
            const data = req.body;
            await userService.updateUser(req.user?.id, data);
            await res.code(200).send({
                status: 'Success',
                data: 'User updated successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }

    async deleteUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            await userService.deleteUser(req.user?.id);
            await res.code(200).send({
                status: 'Success',
                data: 'User deleted successfully'
            });
        } catch (error) {
            throw new ApiError(400, error.message);
        }
    }
}

export const userController = new UserControllers();