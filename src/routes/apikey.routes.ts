import express from 'express';
import { authenticate } from '../auth/authentication';
import { apiKeyController } from '../controllers/apikey.controller';
import { rateLimiter } from '../middleware/rateLimiter';

export const apiKeyRoutes = express.Router();

apiKeyRoutes.use(authenticate);
apiKeyRoutes.use(rateLimiter);

apiKeyRoutes.get('/', apiKeyController.getApiKeysByUser);

apiKeyRoutes.post('/', apiKeyController.createApiKey);

apiKeyRoutes.put('/:id', apiKeyController.updateApiKey);

apiKeyRoutes.delete('/:id', apiKeyController.deleteApiKey);
