import { Router } from 'express';
import { isGuildFullEndpoint } from '../controllers';
import { isValidGuild } from '../middlewares/isValidMiddleware';

const router = Router();

router.post('/guild/isFull', isValidGuild, isGuildFullEndpoint);

export default router;
