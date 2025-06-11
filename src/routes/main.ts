import { userRoutes } from './user.routes';
import { apiKeyRoutes } from './apikey.routes';
import { rateLimitRoutes } from './ratelimitRule.routes';
import { FastifyInstance } from 'fastify';
import { apiConfigRoutes } from './apiConfig.routes';
import { validationRoutes } from './validation.routes';

export const initRoutes = (app: FastifyInstance): void => {
    app.register(userRoutes, { prefix: '/api/v1/user'});
    app.register(apiKeyRoutes, { prefix: '/api/v1/apikey'});
    app.register(rateLimitRoutes, { prefix: '/api/v1/rules'})
    app.register(apiConfigRoutes, { prefix: '/api/v1/apiconfig'})
    app.register(validationRoutes, { prefix: '/api/v1/validation' });
}