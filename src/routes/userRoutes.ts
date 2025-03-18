import express from 'express';
import { userController } from '../controllers/user.controllers';

export const userRoutes = express.Router();

userRoutes.get('/users/:id', userController.getUserById);

userRoutes.post('/users', userController.createUser);

userRoutes.put('/users/:id', userController.updateUser);

userRoutes.delete('/users/:id', userController.deleteUser);