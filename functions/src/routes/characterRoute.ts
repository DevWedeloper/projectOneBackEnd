import { Router } from 'express';
import {
  getAllCharacters,
  getCharacterById,
  getCharacterByName,
  searchCharactersByName,
  createCharacter,
  updateCharacterAttributeById,
  joinGuildById,
  leaveGuildById,
  deleteCharacterById,
  deleteAllCharacters,
} from '../controllers/characterController';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { isValidAttribute } from '../middlewares/isValidAtributeMiddleware';
import { checkCharacterExistence } from '../middlewares/checkCharacterExistence';
import { isValidCharacterType } from '../middlewares/isValidCharacterTypeMiddleware';
import { isValidGuild } from '../middlewares/isValidGuildMiddleware';

const router: Router = Router();

router.post('/', isAdminMiddleware, isValidCharacterType, createCharacter);
router.get('/', getAllCharacters);
router.get('/search', searchCharactersByName);
router.get('/:id', getCharacterById);
router.get('/name/:name', getCharacterByName);
router.put(
  '/join/:id',
  isAdminMiddleware,
  checkCharacterExistence,
  isValidGuild,
  joinGuildById
);
router.put(
  '/leave/:id',
  isAdminMiddleware,
  checkCharacterExistence,
  leaveGuildById
);
router.delete(
  '/:id',
  isAdminMiddleware,
  checkCharacterExistence,
  deleteCharacterById
);
router.delete('/', isAdminMiddleware, deleteAllCharacters);
router.put(
  '/:attribute/:id',
  isAdminMiddleware,
  isValidAttribute,
  isValidCharacterType,
  checkCharacterExistence,
  updateCharacterAttributeById
);

export default router;
