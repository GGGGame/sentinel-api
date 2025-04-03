import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { apiKeyController } from '../controllers/apikey.controller';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateApiKey } from '../middleware/validateApiKey';


export const apiKeyRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("onRequest", validateApiKey)
    app.addHook("preHandler", rateLimiter);
  
    app.get("/", apiKeyController.getApiKeysByUser);

    app.post("/", apiKeyController.createApiKey);

    app.put("/:id", apiKeyController.updateApiKey);

    app.delete("/:id", apiKeyController.deleteApiKey);
}
