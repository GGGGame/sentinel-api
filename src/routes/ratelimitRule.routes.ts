import { rateLimiterController } from '../controllers/ratelimiter.controller';
import { authenticate } from '../auth/authentication';
import { FastifyInstance } from 'fastify';
import { validateApiKey } from '../middleware/validateApiKey';

export const rateLimitRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("onRequest", validateApiKey);

    app.post('/', rateLimiterController.createRateLimitRule);
}