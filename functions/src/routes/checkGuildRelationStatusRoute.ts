import { Router } from 'express';
import { checkGuildRelationStatusEnpoint } from '../controllers';
import { isValidCharacter } from '../middlewares/isValidMiddleware';

const router = Router();

router.post(
  '/character/checkGuildRelationStatus',
  isValidCharacter,
  checkGuildRelationStatusEnpoint
);

export default router;
