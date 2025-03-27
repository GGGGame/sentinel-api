import express from 'express';
import { rateLimiterController } from '../controllers/ratelimiter.controller';
import { authenticate } from '../auth/authentication';

export const rateLimitRoutes = express.Router();

rateLimitRoutes.use(authenticate);

rateLimitRoutes.post('/', rateLimiterController.createRateLimitRule);