import { Router } from 'express';
import {
  getTopGuildsByAttribute,
  getTopWellRoundedGuilds,
  getTopGuildsByAverageAttribute,
} from '../controllers/guildStatsController';
import { isValidAttribute } from '../middlewares/isValidAtributeMiddleware';

const router: Router = Router();

router.get('/topAttribute/:attribute', isValidAttribute, getTopGuildsByAttribute);
router.get('/topWellRounded', getTopWellRoundedGuilds);
router.get('/averageAttribute/:attribute', isValidAttribute, getTopGuildsByAverageAttribute);

export default router;
