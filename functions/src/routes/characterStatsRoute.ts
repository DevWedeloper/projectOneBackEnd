import { Router } from 'express';
import {
  getAverageCharacterStatsEndpoint,
  getCharacterDistributionByTypeEndpoint,
  getTopCharactersByAttributeEndpoint,
  getTopWellRoundedCharactersEndpoint,
} from '../controllers';

const router = Router();

router.get('/topStats/:attribute', getTopCharactersByAttributeEndpoint);
router.get('/topWellRounded', getTopWellRoundedCharactersEndpoint);
router.get('/averageStats', getAverageCharacterStatsEndpoint);
router.get('/characterDistribution', getCharacterDistributionByTypeEndpoint);

export default router;
