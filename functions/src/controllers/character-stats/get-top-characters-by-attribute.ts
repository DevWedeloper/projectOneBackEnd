import { NextFunction, Request, Response } from 'express';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';
import { getTopCharactersByAttribute } from '../../use-cases/types/character-stats.type';

export const makeGetTopCharactersByAttributeEndpoint = ({
  getTopCharactersByAttribute,
}: {
  getTopCharactersByAttribute: getTopCharactersByAttribute;
}) => {
  const getTopCharactersByAttributeEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    const { attribute } = req.params;
    try {
      const limit = 5;
      const characters = await getTopCharactersByAttribute(
        attribute as ValidStatsAttribute,
        limit,
      );
      return res.status(200).json(characters);
    } catch (error) {
      next(error);
    }
  };
  return getTopCharactersByAttributeEndpoint;
};
