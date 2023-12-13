import { Router } from 'express';
import { checkGuildRelationStatus } from '../controllers/checkGuildRelationStatusController';
import { isValidCharacter } from '../middlewares/isValidMiddleware';

const router = Router();

router.post('/character/checkGuildRelationStatus', isValidCharacter, checkGuildRelationStatus);

export default router;
