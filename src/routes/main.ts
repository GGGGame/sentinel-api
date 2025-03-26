import { Express } from 'express';
import { userRoutes } from './user.routes';
import { apiKeyRoutes } from './apikey.routes';
import { rateLimitRoutes } from './ratelimitRule.routes';

export const initRoutes = (app: Express): void => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/apikey', apiKeyRoutes);
    app.use('/api/v1/rules', rateLimitRoutes)
}