import { NextFunction, Request, Response } from 'express';
import { getTopWellRoundedGuilds } from '../../use-cases/types/guild-stats.type';

export const makeGetTopWellRoundedGuildsEndpoint = ({
  getTopWellRoundedGuilds,
}: {
  getTopWellRoundedGuilds: getTopWellRoundedGuilds;
}) => {
  const getTopWellRoundedGuildsEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const limit = 5;

      const guilds = await getTopWellRoundedGuilds(limit);
      return res.json(guilds);
    } catch (error) {
      next(error);
    }
  };
  return getTopWellRoundedGuildsEndpoint;
};
