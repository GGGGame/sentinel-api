import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { userController } from '../controllers/user.controller';
import { validateApiKey } from '../middleware/validateApiKey';

const middlewares = [ authenticate, validateApiKey ];

export const userRoutes = async (app: FastifyInstance) => {
    app.get('/', {
        onRequest: middlewares
    }, userController.getUserById);

    app.post('/login', userController.login);
    app.post('/', userController.createUser);

    app.put('/', {
        onRequest: middlewares
    }, userController.updateUser);

    app.delete('/', {
        onRequest: middlewares
    }, userController.deleteUser);
};
