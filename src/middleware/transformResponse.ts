import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiConfigService } from "../services/apiConfig.service";
import { ResponseTransformer } from "./transformResponses/responseTransformer";
import { apiConfigQuery } from "../query/ApiConfig.query";


export const transformResponse = async (req: FastifyRequest, res: FastifyReply, payload: any): Promise<any> => {
    try {
        if (payload === undefined) {
                return;
            }
    
            const transformHeader = req.headers["x-sentinel-transform-response"] as string;
            // Simply stop the middleware if the header is not present or expected
            // There is no need to return an error
    
            if (!transformHeader || req.user.id == null) {
                return payload;
            }
    
            const headerSplit = transformHeader.split(" ");
            if (headerSplit.length !== 1) {
                throw new ApiError(400, "Invalid transform header format");
            }
    
            const transform = await apiConfigService.getApiConfigbyUser(req.user.id);
            if (!transform) {
                return payload;
            }
    
            const transformRes = transform.transformResponse;
            const transformer = new ResponseTransformer();
    
            for (const key in transformRes) {
                if (typeof transformRes[key] !== "string") {
                    throw new ApiError(401, `Invalid format of transform key: ${key}`);
                }
    
                await transformer.transform(key, payload);
            }
    
            return payload;
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}
