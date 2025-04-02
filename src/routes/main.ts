import { userRoutes } from './user.routes';
import { apiKeyRoutes } from './apikey.routes';
import { rateLimitRoutes } from './ratelimitRule.routes';
import { FastifyInstance } from 'fastify';

export const initRoutes = (app: FastifyInstance): void => {
    app.register(userRoutes, { prefix: '/api/v1/user'});
    app.register(apiKeyRoutes, { prefix: '/api/v1/apikey'});
    app.register(rateLimitRoutes, { prefix: '/api/v1/rules'},)
}