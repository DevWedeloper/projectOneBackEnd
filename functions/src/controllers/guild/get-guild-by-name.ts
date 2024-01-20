import { NextFunction, Request, Response } from 'express';
import { getGuildByName } from '../../use-cases/types/guild.type';

export const makeGetGuildByNameEndpoint = ({
  getGuildByName,
}: {
  getGuildByName: getGuildByName;
}) => {
  const getGuildByNameEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { name } = req.params;

      const guild = await getGuildByName(name);
      return res.status(200).json(guild);
    } catch (error) {
      next(error);
    }
  };
  return getGuildByNameEndpoint;
};
