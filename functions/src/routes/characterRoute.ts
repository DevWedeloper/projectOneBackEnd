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
import {
  checkCharacterExistenceMiddleware,
  isAdminMiddleware,
  isValidCharacterTypeMiddleware,
  isValidGuildMiddleware,
} from '../middlewares';

const router = Router();

router.post(
  '/',
  isAdminMiddleware,
  isValidCharacterTypeMiddleware,
  createCharacterEndpoint,
);
router.get('/', getPaginatedCharactersEndpoint);
router.get('/search', searchCharactersByNameEndpoint);
router.get('/:id', getCharacterByIdEndpoint);
router.get('/name/:name', getCharacterByNameEndpoint);
router.put(
  '/join/:id',
  isAdminMiddleware,
  checkCharacterExistenceMiddleware,
  isValidGuildMiddleware,
  joinGuildByIdEndpoint,
);
router.put(
  '/leave/:id',
  isAdminMiddleware,
  checkCharacterExistenceMiddleware,
  leaveGuildByIdEndpoint,
);
router.delete(
  '/:id',
  isAdminMiddleware,
  checkCharacterExistenceMiddleware,
  deleteCharacterByIdEndpoint,
);
router.delete('/', isAdminMiddleware, deleteAllCharactersEndpoint);
router.put(
  '/:attribute/:id',
  isAdminMiddleware,
  isValidCharacterTypeMiddleware,
  checkCharacterExistenceMiddleware,
  updateCharacterAttributeByIdEndpoint,
);

export default router;
