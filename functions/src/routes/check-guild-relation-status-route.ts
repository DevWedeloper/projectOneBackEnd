import { Router } from 'express';
import { checkGuildRelationStatusEndpoint } from '../controllers';
import { isValidCharacterMiddleware } from '../middlewares';

const router = Router();

router.post(
  '/character/checkGuildRelationStatus',
  isValidCharacterMiddleware,
  checkGuildRelationStatusEndpoint,
);

export default router;
