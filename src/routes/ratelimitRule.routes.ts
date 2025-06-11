import { rateLimiterController } from '../controllers/ratelimiter.controller';
import { authenticate } from '../auth/authentication';
import { FastifyInstance } from 'fastify';
import { validateData } from '../middleware/validation';

const preValidation = [ validateData ];

export const rateLimitRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);

    app.get('/', rateLimiterController.getRateLimitRules);

    app.post('/', {
        preValidation: preValidation
    }, rateLimiterController.createRateLimitRule);
}