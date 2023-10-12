// routes/characterRoute.ts
import { Router } from 'express';
import { getCharacterTypes } from '../controllers/characterTypeControllers';

const router = Router();

router.get('/', getCharacterTypes);

export default router;
