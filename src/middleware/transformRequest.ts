import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiConfigService } from "../services/apiConfig.service";
import { RequestTransformer } from "./transformRequests/requestTransformer";
import { transformerHeader } from "../enums/transformerHeader.enum";

export const transformRequest = async (req: FastifyRequest<{ Body: Record<string, string> }>, res: FastifyReply): Promise<void> => {
    try {
        const transformHeader = req.headers["x-sentinel-transform"] as string;
        // Simply stop the middleware if the header is not present or expected
        // There is no need to return an error
        if (!transformHeader || req.user.id == null) {
            return;
        }

        const headerSplit = transformHeader.split(" ");
        if (headerSplit.length > 2) {
            throw new ApiError(401, "Invalid transform header format");
        }

        if (!headerSplit.includes(transformerHeader.request)) {
            return;
        }

        const transform = await apiConfigService.getApiConfigbyUser(req.user.id);
        if (!transform) {
            throw new ApiError(401, "Your user does not have any transform rules setted");
        }

        const transformReq = transform.transformRequest;

        const transformer = new RequestTransformer();
        
        for (const [keys, value] of Object.entries(transformReq)) {
            for (const data in value) {
                if (!req.body[transformReq[keys][data]]) {
                    continue;
                }
                await transformer.transform(keys, req.body, transformReq[keys][data]);
            }
        }

    } catch (error) {
        throw new ApiError(400, error.message);
    }
}