import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiConfigService } from "../services/apiConfig.service";
import { RequestTransformer } from "./transformRequests/requestTransformer";

export const transformRequest = async (req: FastifyRequest<{ Body: Record<string, string> }>, res: FastifyReply): Promise<void> => {
    try {
        const transformHeader = req.headers["x-sentinel-transform"] as string;
        // Simply stop the middleware if the header is not present or expected
        // There is no need to return an error
        if (!transformHeader || req.user.id == null) {
            return;
        }

        const headerSplit = transformHeader.split(" ");
        if (headerSplit.length !== 1) {
            throw new ApiError(401, "Invalid transform header format");
        }

        const transform = await apiConfigService.getApiConfigbyUser(req.user.id);
        if (!transform) {
            throw new ApiError(401, "Your user does not have any transform rules setted");
        }

        const transformReq = transform.transformRequest;

        const transformer = new RequestTransformer();
        
        for (const key in transformReq) {
            if (typeof transformReq[key] !== "string" || 
                !req.body[transformReq[key]]) {
                throw new ApiError(401, `Invalid format of transform key: ${key}`);
            }

            await transformer.transform(key, req.body, transformReq[key]);
        }

    } catch (error) {
        throw new ApiError(400, error.message);
    }
}