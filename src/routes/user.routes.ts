import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { userController } from '../controllers/user.controller';

const auth = { preHandler: authenticate };

export const userRoutes = async (app: FastifyInstance) => {
    app.get('/', auth, userController.getUserById);

    app.post('/login', userController.login);
    app.post('/', userController.createUser);

    app.put('/', auth, userController.updateUser);

    app.delete('/', auth, userController.deleteUser);
};
