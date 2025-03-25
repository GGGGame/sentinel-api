import { Express } from 'express';
import { userRoutes } from './user.routes';
import { apiKeyRoutes } from './apikey.routes';

export const initRoutes = (app: Express): void => {
    app.use('/api/v1', userRoutes);
    app.use('/api/v1', apiKeyRoutes);
}