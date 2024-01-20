import { NextFunction, Request, Response } from 'express';
import { getAverageCharacterStats } from '../../use-cases/types/character-stats.type';

export const makeGetAverageCharacterStatsEndpoint = ({
  getAverageCharacterStats,
}: {
  getAverageCharacterStats: getAverageCharacterStats;
}) => {
  const getAverageCharacterStatsEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const averageStats = await getAverageCharacterStats();
      return res.status(200).json(averageStats);
    } catch (error) {
      next(error);
    }
  };
  return getAverageCharacterStatsEndpoint;
};
