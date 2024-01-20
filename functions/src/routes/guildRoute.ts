import { Router } from 'express';
import {
  addMemberToGuildByIdEndpoint,
  createGuildEndpoint,
  deleteAllGuildsEndpoint,
  deleteGuildByIdEndpoint,
  getGuildByIdEndpoint,
  getGuildByNameEndpoint,
  getPaginatedGuildsEndpoint,
  removeMemberFromGuildByIdEndpoint,
  searchGuildMemberByIdEndpoint,
  searchGuildsByNameEndpoint,
  updateGuildLeaderByIdEndpoint,
  updateGuildNameByIdEndpoint,
} from '../controllers';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { checkGuildExistence } from '../middlewares/isExistingMiddleware';
import { isValidCharacter } from '../middlewares/isValidMiddleware';

const router = Router();

router.post('/', isAdminMiddleware, isValidCharacter, createGuildEndpoint);
router.get('/', getPaginatedGuildsEndpoint);
router.get('/search', searchGuildsByNameEndpoint);
router.get(
  '/:id/searchMember',
  checkGuildExistence,
  searchGuildMemberByIdEndpoint
);
router.get('/:id', getGuildByIdEndpoint);
router.get('/name/:name', getGuildByNameEndpoint);
router.put(
  '/name/:id',
  isAdminMiddleware,
  checkGuildExistence,
  updateGuildNameByIdEndpoint
);
router.put(
  '/leader/:id',
  isAdminMiddleware,
  checkGuildExistence,
  isValidCharacter,
  updateGuildLeaderByIdEndpoint
);
router.put(
  '/addMember/:id',
  isAdminMiddleware,
  checkGuildExistence,
  isValidCharacter,
  addMemberToGuildByIdEndpoint
);
router.put(
  '/removeMember/:id',
  isAdminMiddleware,
  checkGuildExistence,
  isValidCharacter,
  removeMemberFromGuildByIdEndpoint
);
router.delete(
  '/:id',
  isAdminMiddleware,
  checkGuildExistence,
  deleteGuildByIdEndpoint
);
router.delete('/', isAdminMiddleware, deleteAllGuildsEndpoint);

export default router;
