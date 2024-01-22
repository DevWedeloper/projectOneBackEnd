import { Router } from 'express';
import { isGuildFullEndpoint } from '../controllers';
import { isValidGuildMiddleware } from '../middlewares';

const router = Router();

router.post('/guild/isFull', isValidGuildMiddleware, isGuildFullEndpoint);

export default router;
