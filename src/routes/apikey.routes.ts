import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { apiKeyController } from '../controllers/apikey.controller';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateApiKey } from '../middleware/validateApiKey';

const onRequestMiddleware = [ validateApiKey ];

export const apiKeyRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("preHandler", rateLimiter);
  
    app.get("/", apiKeyController.getApiKeysByUser);

    app.post("/", apiKeyController.createApiKey);

    app.put("/:id", {
        onRequest: onRequestMiddleware,
    }, apiKeyController.updateApiKey);

    app.delete("/:id", {
        onRequest: onRequestMiddleware,
    }, apiKeyController.deleteApiKey);
}
