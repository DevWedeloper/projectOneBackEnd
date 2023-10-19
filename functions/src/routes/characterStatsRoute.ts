import { Router } from 'express';
import {
  getTopCharactersByAttribute,
  getTopWellRoundedCharacters,
  getAverageCharacterStats,
  getCharacterDistributionByType,
} from '../controllers/characterStatsController';
import { isValidAttribute } from '../middlewares/isValidAtributeMiddleware';

const router: Router = Router();

router.get('/topStats/:attribute', isValidAttribute, getTopCharactersByAttribute);
router.get('/topWellRounded', getTopWellRoundedCharacters);
router.get('/averageStats', getAverageCharacterStats);
router.get('/characterDistribution', getCharacterDistributionByType);

export default router;
