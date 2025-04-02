import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/authentication';
import { apiKeyController } from '../controllers/apikey.controller';
import { rateLimiter } from '../middleware/rateLimiter';


export const apiKeyRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("preHandler", rateLimiter);
  
    app.post("/response", apiKeyController.basicResponse);
    app.get("/", apiKeyController.getApiKeysByUser);

    app.post("/", apiKeyController.createApiKey);

    app.put("/:id", apiKeyController.updateApiKey);

    app.delete("/:id", apiKeyController.deleteApiKey);
}
