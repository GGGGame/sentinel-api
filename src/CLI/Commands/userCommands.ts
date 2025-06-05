import { Command } from "commander";
import { InsertUser } from "../../db";
import { userService } from "../../services/user.service";
import { LoggerService } from "../../utils/Logger.util";
import { ApiError } from "../../utils/Error/ApiError";
import { passwords } from "../../auth/passwords";
import { jwtService } from "../../auth/jwt.service";

const logger = LoggerService.getInstance();

export const UserCommands = (program: Command) => {

    //#region Create User

    program
        .command("create-user")
        .description("Create a new user")
        .requiredOption('-n, --name <name>', 'Name of the user')
        .requiredOption('-e, --email <email>', 'Email of the user')
        .requiredOption('-p, --password <password>', 'Password of the user')
        .action(async (userData: InsertUser) => {
            await userService.createUser(userData);
            
            
            logger.info(`User created: Name: ${userData.name}, Email: ${userData.email}`);
        });

    //#endregion
    
    //#region Login (Get Token)

    program
        .command("login")
        .description("Login your user to get a token")
        .requiredOption('-e, --email <email>', 'Email of the user')
        .requiredOption('-p, --password <password>', 'Password of the user')
        .action(async (userData: { email: string, password: string }) => {
            const { email, password } = userData;

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
                
                logger.info(`Token generated: ${token}`);
            } catch (error) {
                throw new ApiError(400, error.message);
            }
        });
        
    //#endregion
}