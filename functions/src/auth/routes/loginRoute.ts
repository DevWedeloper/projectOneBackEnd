import { Router } from 'express';
import { login } from '../controllers/loginController';
import { refreshAccessToken } from '../controllers/refreshAccessTokenController';

const router: Router = Router();

router.post('/login', login);
router.post('/refresh', refreshAccessToken);

export default router;
