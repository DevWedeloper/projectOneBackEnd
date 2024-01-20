import { Router } from 'express';
import { isMemberEndpoint, isNotMemberEndpoint } from '../controllers';
const router = Router();

router.post('/guild/isMember', isMemberEndpoint);
router.post('/guild/isNotMember', isNotMemberEndpoint);

export default router;
