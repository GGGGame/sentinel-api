import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { apiConfigService } from "../services/apiConfig.service";
import { ResponseTransformer } from "./transformResponses/responseTransformer";
import { apiConfigQuery } from "../query/ApiConfig.query";
import { transformerHeader } from "../enums/transformerHeader.enum";


export const transformResponse = async (req: FastifyRequest, res: FastifyReply, payload: any): Promise<any> => {
    try {
        if (payload === undefined) {
            return;
        }

        const transformHeader = req.headers["x-sentinel-transform"] as string;
        // Simply stop the middleware if the header is not present or expected
        // There is no need to return an error

        if (!transformHeader || req.user.id == null) {
            return payload;
        }

        const headerSplit = transformHeader.split(" ");

        if (headerSplit.length > 2) {  
            throw new ApiError(400, "Invalid transform header format");
        }

        if (!headerSplit.includes(transformerHeader.response)) {
            return payload;
        }

        const transform = await apiConfigService.getApiConfigbyUser(req.user.id);
        if (!transform) {
            return payload;
        }

        const transformRes = transform.transformResponse;
        const transformer = new ResponseTransformer();

        for (const [keys, value] of Object.entries(transformRes)) {
            for (const data in value) {
                // console.log(keys);
                // console.log(data);
                // console.log(transformRes[keys][data]);

                await transformer.transform(keys, payload.data, transformRes[keys][data]);
            }
            // if (typeof transformRes[key] !== "string") {
            //     throw new ApiError(401, `Invalid format of transform key: ${key}`);
            // }

            // await transformer.transform(key, payload);
        }

        return payload;
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}
