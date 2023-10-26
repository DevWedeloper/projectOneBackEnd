import { Router } from 'express';
import { checkIfMember } from '../controllers/checkIfMemberController';
import { isValidCharacter } from '../middlewares/isValidCharacterMiddleware';
import { isValidGuild } from '../middlewares/isValidGuildMiddleware';

const router: Router = Router();

router.post('/guild/checkIfMember', isValidCharacter, isValidGuild, checkIfMember);

export default router;
