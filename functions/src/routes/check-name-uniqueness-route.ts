import { Router } from 'express';
import {
  isCharacterNameUniqueEndpoint,
  isGuildNameUniqueEndpoint,
} from '../controllers';

const router = Router();

router.post('/character/unique', isCharacterNameUniqueEndpoint);
router.post('/guild/unique', isGuildNameUniqueEndpoint);

export default router;
