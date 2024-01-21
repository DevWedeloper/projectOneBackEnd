import { Router } from 'express';
import {
  createCharacterEndpoint,
  deleteAllCharactersEndpoint,
  deleteCharacterByIdEndpoint,
  getCharacterByIdEndpoint,
  getCharacterByNameEndpoint,
  getPaginatedCharactersEndpoint,
  joinGuildByIdEndpoint,
  leaveGuildByIdEndpoint,
  searchCharactersByNameEndpoint,
  updateCharacterAttributeByIdEndpoint,
} from '../controllers';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { checkCharacterExistence } from '../middlewares/isExistingMiddleware';
import { isValidCharacterType } from '../middlewares/isValidCharacterTypeMiddleware';
import { isValidGuild } from '../middlewares/isValidMiddleware';

const router = Router();

router.post(
  '/',
  isAdminMiddleware,
  isValidCharacterType,
  createCharacterEndpoint,
);
router.get('/', getPaginatedCharactersEndpoint);
router.get('/search', searchCharactersByNameEndpoint);
router.get('/:id', getCharacterByIdEndpoint);
router.get('/name/:name', getCharacterByNameEndpoint);
router.put(
  '/join/:id',
  isAdminMiddleware,
  checkCharacterExistence,
  isValidGuild,
  joinGuildByIdEndpoint,
);
router.put(
  '/leave/:id',
  isAdminMiddleware,
  checkCharacterExistence,
  leaveGuildByIdEndpoint,
);
router.delete(
  '/:id',
  isAdminMiddleware,
  checkCharacterExistence,
  deleteCharacterByIdEndpoint,
);
router.delete('/', isAdminMiddleware, deleteAllCharactersEndpoint);
router.put(
  '/:attribute/:id',
  isAdminMiddleware,
  isValidCharacterType,
  checkCharacterExistence,
  updateCharacterAttributeByIdEndpoint,
);

export default router;
