import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiConfigService } from "../services/apiConfig.service";

export const transformResponse = async (req: FastifyRequest, res: FastifyReply, payload: any): Promise<void> => {
    if (req.user.id == null) {
        return payload;
    }
    try {
        const transform = await apiConfigService.getApiConfigbyUser(req.user.id);
        if (!transform) {
            return payload;
        }

        const objRes = JSON.parse(payload);

        const transformRes = transform.transformResponse;

        for (const key in transformRes) {
            if (typeof transformRes[key] !== "string") {
                throw new ApiError(401, `Invalid format of transform key: ${key}`);
            }

            console.log(key);
            console.log(objRes.data);
            console.log(objRes[key]);
        }

        
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}