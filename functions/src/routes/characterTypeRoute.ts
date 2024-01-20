import { Router } from 'express';
import { getAllCharacterTypesEndpoint } from '../controllers';

const router = Router();

router.get('/', getAllCharacterTypesEndpoint);

export default router;
