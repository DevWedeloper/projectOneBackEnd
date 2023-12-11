import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/userController';
import { loggedInUserMiddleware } from '../middlewares/loggedInUserMiddleware';

const router: Router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', loggedInUserMiddleware, updateUserById);
router.delete('/:id', loggedInUserMiddleware, deleteUserById);

export default router;
