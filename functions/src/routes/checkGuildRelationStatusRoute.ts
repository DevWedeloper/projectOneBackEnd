import { Router } from 'express';
import { checkGuildRelationStatus } from '../controllers/checkGuildRelationStatusController';
import { isValidCharacter } from '../middlewares/isValidCharacterMiddleware';

const router: Router = Router();

router.post('/character/checkGuildRelationStatus', isValidCharacter, checkGuildRelationStatus);

export default router;
