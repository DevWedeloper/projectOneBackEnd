import { Router } from 'express';
import { checkIfMember } from '../controllers/isMemberController';
import { isValidCharacter } from '../middlewares/isValidMiddleware';
import { isValidGuild } from '../middlewares/isValidMiddleware';

const router = Router();

router.post('/guild/checkIfMember', isValidCharacter, isValidGuild, checkIfMember);

export default router;
