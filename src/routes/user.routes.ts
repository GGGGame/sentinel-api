import express from 'express';
import { authenticate } from '../auth/authentication';
import { userController } from '../controllers/user.controller';

export const userRoutes = express.Router();

userRoutes.get('/', authenticate, userController.getUserById);

userRoutes.post('/login', userController.login);
userRoutes.post('', userController.createUser);

userRoutes.put('/', authenticate, userController.updateUser);

userRoutes.delete('/', authenticate, userController.deleteUser);