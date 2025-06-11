import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { userController } from '../controllers/user.controller';
import { validateApiKey } from '../middleware/validateApiKey';
import { transformRequest } from '../middleware/transformRequest';
import { transformResponse } from '../middleware/transformResponse';
import { validateData } from '../middleware/validation';

const onRequestMiddleware = [ authenticate, validateApiKey ];
const preHandlerMiddleware = [ transformRequest ];
const preSerialization = [ transformResponse ];
const preValidation = [ validateData ];

export const userRoutes = async (app: FastifyInstance) => {

    app.get('/', {
        onRequest: onRequestMiddleware,
        preHandler: preHandlerMiddleware,
        preSerialization: preSerialization
    }, userController.getUserById);

    app.post('/login', userController.login);
    app.post('/', {
        preHandler: preHandlerMiddleware
    }, userController.createUser);

    app.put('/', {
        onRequest: onRequestMiddleware,
        preValidation: preValidation
    }, userController.updateUser);

    app.delete('/', {
        onRequest: onRequestMiddleware
    }, userController.deleteUser);
};
