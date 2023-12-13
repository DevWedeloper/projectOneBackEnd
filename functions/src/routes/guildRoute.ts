import { Router } from 'express';
import {
  createGuild,
  getAllGuilds,
  getGuildById,
  getGuildByName,
  searchGuildsByName,
  searchGuildMemberById,
  updateGuildNameById,
  updateGuildLeaderById,
  addMemberToGuildById,
  removeMemberFromGuildById,
  deleteGuildById,
  deleteAllGuilds,
} from '../controllers/guildController';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { checkGuildExistence } from '../middlewares/isExistingMiddleware';
import { isValidCharacter } from '../middlewares/isValidCharacterMiddleware';

const router: Router = Router();

router.post('/', isAdminMiddleware, isValidCharacter, createGuild);
router.get('/', getAllGuilds);
router.get('/search', searchGuildsByName);
router.get('/:id/searchMember', checkGuildExistence, searchGuildMemberById);
router.get('/:id', getGuildById);
router.get('/name/:name', getGuildByName);
router.put(
  '/name/:id',
  isAdminMiddleware,
  checkGuildExistence,
  updateGuildNameById
);
router.put(
  '/leader/:id',
  isAdminMiddleware,
  checkGuildExistence,
  isValidCharacter,
  updateGuildLeaderById
);
router.put(
  '/addMember/:id',
  isAdminMiddleware,
  checkGuildExistence,
  isValidCharacter,
  addMemberToGuildById
);
router.put(
  '/removeMember/:id',
  isAdminMiddleware,
  checkGuildExistence,
  isValidCharacter,
  removeMemberFromGuildById
);
router.delete('/:id', isAdminMiddleware, checkGuildExistence, deleteGuildById);
router.delete('/', isAdminMiddleware, deleteAllGuilds);

export default router;
