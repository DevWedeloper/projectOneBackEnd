import { NextFunction, Request, Response } from 'express';
import { getGuildByNameOrId } from '../../use-cases/types/guild.type';

export const makeIsValidGuildMiddleware = ({
  getGuildByNameOrId,
}: {
  getGuildByNameOrId: getGuildByNameOrId;
}) => {
  const isValidGuildMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { guild } = req.body;
      if (!guild) {
        return next();
      }

      const foundGuild = await getGuildByNameOrId(guild);
      req.body.guild = foundGuild;
      next();
    } catch (error) {
      next(error);
    }
  };
  return isValidGuildMiddleware;
};
