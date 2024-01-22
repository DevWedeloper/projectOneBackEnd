import { Router } from 'express';
import { checkGuildRelationStatusEnpoint } from '../controllers';
import { isValidCharacterMiddleware } from '../middlewares';

const router = Router();

router.post(
  '/character/checkGuildRelationStatus',
  isValidCharacterMiddleware,
  checkGuildRelationStatusEnpoint,
);

export default router;
