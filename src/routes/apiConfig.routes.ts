import { FastifyInstance } from "fastify";
import { apiConfigController } from "../controllers/apiConfig.controller";
import { rateLimiter } from "../middleware/rateLimiter";
import { validateApiKey } from "../middleware/validateApiKey";
import { authenticate } from "../auth/authentication";
import { transformRequest } from "../middleware/transformRequest";
import { transformResponse } from "../middleware/transformResponse";
import { validateData } from "../middleware/validation";

const preValidation = [ validateData ];

export const apiConfigRoutes = async (app: FastifyInstance) => {
    app.addHook("onRequest", authenticate);
    app.addHook("onRequest", validateApiKey);
    app.addHook("preHandler", rateLimiter);
    app.addHook("preHandler", transformRequest);
    app.addHook("preSerialization", transformResponse);

    app.get("/", apiConfigController.getApiConfigByUser);

    app.post("/", {
        preValidation: preValidation,
    }, apiConfigController.createApiConfig);

    app.put("/:id", {
        preValidation: preValidation,
    }, apiConfigController.updateApiConfig);

    app.delete("/:id", apiConfigController.deleteApiConfig);

    app.post("/test", (req, reply) => {
        const { body } = req;
        reply.send({ message: "Test endpoint hit", data: body });
    });
}