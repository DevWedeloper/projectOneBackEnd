import { NextFunction, Request, Response } from 'express';
import { getGuildById } from '../../use-cases/types/guild.type';

export const makeGetGuildByIdEndpoint = ({
  getGuildById,
}: {
  getGuildById: getGuildById;
}) => {
  const getGuildByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      const guild = await getGuildById(id);
      return res.status(200).json(guild);
    } catch (error) {
      next(error);
    }
  };
  return getGuildByIdEndpoint;
};
