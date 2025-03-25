import express from 'express';
import { authenticate } from '../auth/authentication';
import { apiKeyController } from '../controllers/apikey.controller';

export const apiKeyRoutes = express.Router();

apiKeyRoutes.get('/keys', authenticate, apiKeyController.getApiKeysByUser);

apiKeyRoutes.post('/keys', authenticate, apiKeyController.createApiKey);

apiKeyRoutes.put('/keys/:id', authenticate, apiKeyController.updateApiKey);

apiKeyRoutes.delete('/keys/:id', authenticate, apiKeyController.deleteApiKey);
