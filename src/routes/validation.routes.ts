import { authenticate } from "../auth/authentication";
import { validationController } from "../controllers/validation.controller";
import { rateLimiter } from "../middleware/rateLimiter";
import { transformRequest } from "../middleware/transformRequest";
import { transformResponse } from "../middleware/transformResponse";
import { validateApiKey } from "../middleware/validateApiKey";

export const validationRoutes = async (app) => {
    app.addHook("onRequest", authenticate);
    app.addHook("onRequest", validateApiKey);
    app.addHook("preHandler", rateLimiter);
    app.addHook("preHandler", transformRequest);
    app.addHook("preSerialization", transformResponse);

    app.get("/", validationController.getValidationsByUser);

    app.post("/", validationController.createValidation);

    app.put("/:id", validationController.updateValidation);

    app.delete("/:id", validationController.deleteValidation);
}