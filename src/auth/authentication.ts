import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/Error/ApiError";
import { jwtService } from "./jwt.service";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new ApiError(401, 'Missing authorization token'));
    }
    
    const headerSplit = authHeader.split(' ');
    // Expected format: Bearer {token}
    if (headerSplit.length !==  2 || headerSplit[0] !== 'Bearer') {
        return next(new ApiError(401, 'Requested wrong format of authorization'))
    }

    const token = headerSplit[1];
    const decoded = jwtService.verifyToken(token);
    
    if (!decoded) {
      return next(new ApiError(401, 'Invalid or expired token'));
    }
    
    req.user = decoded;
    next();
}