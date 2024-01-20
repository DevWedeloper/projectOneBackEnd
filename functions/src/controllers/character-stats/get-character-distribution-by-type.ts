import { NextFunction, Request, Response } from 'express';
import { getCharacterDistributionByType } from '../../use-cases/types/character-stats.type';

export const makeGetCharacterDistributionByTypeEndpoint = ({
  getCharacterDistributionByType,
}: {
  getCharacterDistributionByType: getCharacterDistributionByType;
}) => {
  const getCharacterDistributionByTypeEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const characterDistribution = await getCharacterDistributionByType();
      return res.status(200).json(characterDistribution);
    } catch (error) {
      next(error);
    }
  };
  return getCharacterDistributionByTypeEndpoint;
};
