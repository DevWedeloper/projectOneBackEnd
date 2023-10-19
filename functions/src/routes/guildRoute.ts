import { Router } from 'express';
import {
  createGuild,
  getAllGuilds,
  getGuildById,
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
import { checkGuildExistence } from '../middlewares/checkGuildExistence';

const router: Router = Router();

router.post('/', isAdminMiddleware, createGuild);
router.get('/', getAllGuilds);
router.get('/search', searchGuildsByName);
router.get('/:id/searchMember', checkGuildExistence, searchGuildMemberById);
router.get('/:id', getGuildById);
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
  updateGuildLeaderById
);
router.put(
  '/addMember/:id',
  isAdminMiddleware,
  checkGuildExistence,
  addMemberToGuildById
);
router.put(
  '/removeMember/:id',
  isAdminMiddleware,
  checkGuildExistence,
  removeMemberFromGuildById
);
router.delete('/:id', isAdminMiddleware, checkGuildExistence, deleteGuildById);
router.delete('/', isAdminMiddleware, deleteAllGuilds);

export default router;
