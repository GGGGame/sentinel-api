import { FastifyInstance } from "fastify";
import { apiConfigController } from "../controllers/apiConfig.controller";
import { rateLimiter } from "../middleware/rateLimiter";
import { validateApiKey } from "../middleware/validateApiKey";
import { authenticate } from "../auth/authentication";

export const apiConfigRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("onRequest", validateApiKey)
    app.addHook("preHandler", rateLimiter);

    app.get("/", apiConfigController.getApiConfigByUser);

    app.post("/", apiConfigController.createApiConfig);

    app.put("/:id", apiConfigController.updateApiConfig);

    app.delete("/:id", apiConfigController.deleteApiConfig);
}