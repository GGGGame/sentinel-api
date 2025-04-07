import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { userController } from '../controllers/user.controller';
import { validateApiKey } from '../middleware/validateApiKey';
import { transformRequest } from '../middleware/transformRequest';
import { transformResponse } from '../middleware/transformResponse';

const onRequestMiddleware = [ authenticate, validateApiKey ];
const preHandlerMiddleware = [ transformRequest ];
const onSendMiddleware = [ transformResponse ];

export const userRoutes = async (app: FastifyInstance) => {

    app.get('/', {
        onRequest: onRequestMiddleware,
        preHandler: preHandlerMiddleware,
        onSend: onSendMiddleware
    }, userController.getUserById);

    app.post('/login', userController.login);
    app.post('/', {
        preHandler: preHandlerMiddleware
    }, userController.createUser);

    app.put('/', {
        onRequest: onRequestMiddleware
    }, userController.updateUser);

    app.delete('/', {
        onRequest: onRequestMiddleware
    }, userController.deleteUser);
};
