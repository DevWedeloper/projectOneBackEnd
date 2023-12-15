import { Router } from 'express';
import { isMember, isNotMember } from '../controllers/isMemberController';
const router = Router();

router.post('/guild/isMember', isMember);
router.post('/guild/isNotMember', isNotMember);

export default router;
