import { Router } from 'express';
import {
  getTopGuildsByAttributeEndpoint,
  getTopGuildsByAverageAttributeEndpoint,
  getTopWellRoundedGuildsEndpoint,
} from '../controllers';

const router = Router();

router.get('/topAttribute/:attribute', getTopGuildsByAttributeEndpoint);
router.get('/topWellRounded', getTopWellRoundedGuildsEndpoint);
router.get(
  '/averageAttribute/:attribute',
  getTopGuildsByAverageAttributeEndpoint,
);

export default router;
