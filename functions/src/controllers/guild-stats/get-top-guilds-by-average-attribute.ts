import { NextFunction, Request, Response } from 'express';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';
import { getTopGuildsByAverageAttribute } from '../../use-cases/types/guild-stats.type';

export const makeGetTopGuildsByAverageAttributeEndpoint = ({
  getTopGuildsByAverageAttribute,
}: {
  getTopGuildsByAverageAttribute: getTopGuildsByAverageAttribute;
}) => {
  const getTopGuildsByAverageAttributeEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { attribute } = req.params;

      const limit = 5;

      const topGuilds = await getTopGuildsByAverageAttribute(
        attribute as ValidStatsAttribute,
        limit
      );
      return res.json(topGuilds);
    } catch (error) {
      next(error);
    }
  };
  return getTopGuildsByAverageAttributeEndpoint;
};
