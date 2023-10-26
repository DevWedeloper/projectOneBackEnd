import { Router } from 'express';
import {
  isCharacterNameUnique,
  isGuildNameUnique,
} from '../controllers/checkNameUniquenessController';

const router: Router = Router();

router.post('/character/unique', isCharacterNameUnique);
router.post('/guild/unique', isGuildNameUnique);

export default router;
