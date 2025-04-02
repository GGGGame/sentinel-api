import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/Error/ApiError";
import { jwtService } from "./jwt.service";
import { User } from "../db";

declare module 'fastify' {
    interface FastifyRequest {
        user?: User;
    }
}

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(401, 'Missing authorization token');
    }
    
    const headerSplit = authHeader.split(' ');
    // Expected format: Bearer {token}
    if (headerSplit.length !==  2 || headerSplit[0] !== 'Bearer') {
        throw new ApiError(401, 'Requested wrong format of authorization');
    }

    const token = headerSplit[1];
    const decoded = jwtService.verifyToken(token);
    
    if (!decoded) {
      throw new ApiError(401, 'Invalid or expired token');
    }
    
    req.user = await decoded as User;
}