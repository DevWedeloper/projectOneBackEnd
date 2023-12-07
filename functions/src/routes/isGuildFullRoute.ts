import { Router } from 'express';
import { isGuildFull } from '../controllers/isGuildFullController';
import { isValidGuild } from '../middlewares/isValidGuildMiddleware';

const router: Router = Router();

router.post('/guild/isFull', isValidGuild, isGuildFull);

export default router;
