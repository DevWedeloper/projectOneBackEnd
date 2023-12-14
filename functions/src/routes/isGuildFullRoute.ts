import { Router } from 'express';
import { isGuildFull } from '../controllers/isGuildFullController';
import { isValidGuild } from '../middlewares/isValidMiddleware';

const router = Router();

router.post('/guild/isFull', isValidGuild, isGuildFull);

export default router;
