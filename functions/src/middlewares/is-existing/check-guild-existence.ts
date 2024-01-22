import { NextFunction, Request, Response } from 'express';
import { getGuildById } from '../../use-cases/types/guild.type';

export const makeCheckGuildExistenceMiddleware = ({
  getGuildById,
}: {
  getGuildById: getGuildById;
}) => {
  const checkGuildExistenceMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      const guild = await getGuildById(id);
      req.body.guild = guild;
      next();
    } catch (error) {
      next(error);
    }
  };
  return checkGuildExistenceMiddleware;
};
