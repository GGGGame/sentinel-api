import express from 'express';
import { authenticate } from '../auth/authentication';
import { userController } from '../controllers/user.controller';

export const userRoutes = express.Router();

userRoutes.get('/users/', authenticate, userController.getUserById);

userRoutes.post('/users/login', userController.login);
userRoutes.post('/users', userController.createUser);

userRoutes.put('/users/', authenticate, userController.updateUser);

userRoutes.delete('/users/', authenticate, userController.deleteUser);