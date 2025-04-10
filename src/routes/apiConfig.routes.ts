import { FastifyInstance } from "fastify";
import { apiConfigController } from "../controllers/apiConfig.controller";
import { rateLimiter } from "../middleware/rateLimiter";
import { validateApiKey } from "../middleware/validateApiKey";
import { authenticate } from "../auth/authentication";
import { transformRequest } from "../middleware/transformRequest";
import { transformResponse } from "../middleware/transformResponse";

export const apiConfigRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("onRequest", validateApiKey)
    app.addHook("preHandler", rateLimiter);
    app.addHook("preHandler", transformRequest);

    app.get("/", apiConfigController.getApiConfigByUser);

    app.post("/", apiConfigController.createApiConfig);

    app.put("/:id", apiConfigController.updateApiConfig);

    app.delete("/:id", apiConfigController.deleteApiConfig);

    app.post("/test", (req, reply) => {
        const { body } = req;
        reply.send({ message: "Test endpoint hit", body });
    });
}