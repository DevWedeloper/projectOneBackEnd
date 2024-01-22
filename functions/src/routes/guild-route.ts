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
import {
  checkGuildExistenceMiddleware,
  isAdminMiddleware,
  isValidCharacterMiddleware,
} from '../middlewares';

const router = Router();

router.post(
  '/',
  isAdminMiddleware,
  isValidCharacterMiddleware,
  createGuildEndpoint,
);
router.get('/', getPaginatedGuildsEndpoint);
router.get('/search', searchGuildsByNameEndpoint);
router.get(
  '/:id/searchMember',
  checkGuildExistenceMiddleware,
  searchGuildMemberByIdEndpoint,
);
router.get('/:id', getGuildByIdEndpoint);
router.get('/name/:name', getGuildByNameEndpoint);
router.put(
  '/name/:id',
  isAdminMiddleware,
  checkGuildExistenceMiddleware,
  updateGuildNameByIdEndpoint,
);
router.put(
  '/leader/:id',
  isAdminMiddleware,
  checkGuildExistenceMiddleware,
  isValidCharacterMiddleware,
  updateGuildLeaderByIdEndpoint,
);
router.put(
  '/addMember/:id',
  isAdminMiddleware,
  checkGuildExistenceMiddleware,
  isValidCharacterMiddleware,
  addMemberToGuildByIdEndpoint,
);
router.put(
  '/removeMember/:id',
  isAdminMiddleware,
  checkGuildExistenceMiddleware,
  isValidCharacterMiddleware,
  removeMemberFromGuildByIdEndpoint,
);
router.delete(
  '/:id',
  isAdminMiddleware,
  checkGuildExistenceMiddleware,
  deleteGuildByIdEndpoint,
);
router.delete('/', isAdminMiddleware, deleteAllGuildsEndpoint);

export default router;
