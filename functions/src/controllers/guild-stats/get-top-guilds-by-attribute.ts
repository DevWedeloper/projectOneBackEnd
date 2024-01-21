import { NextFunction, Request, Response } from 'express';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';
import { getTopGuildsByAttribute } from '../../use-cases/types/guild-stats.type';

export const makeGetTopGuildsByAttributeEndpoint = ({
  getTopGuildsByAttribute,
}: {
  getTopGuildsByAttribute: getTopGuildsByAttribute;
}) => {
  const getTopGuildsByAttributeEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { attribute } = req.params;

      const limit = 5;

      const topGuilds = await getTopGuildsByAttribute(
        attribute as ValidStatsAttribute,
        limit,
      );
      return res.json(topGuilds);
    } catch (error) {
      next(error);
    }
  };
  return getTopGuildsByAttributeEndpoint;
};
