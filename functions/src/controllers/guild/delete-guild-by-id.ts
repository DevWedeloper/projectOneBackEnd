import { NextFunction, Request, Response } from 'express';
import { deleteGuildById } from '../../use-cases/types/guild.type';

export const makeDeleteGuildByIdEndpoint = ({
  deleteGuildById,
}: {
  deleteGuildById: deleteGuildById;
}) => {
  const deleteGuildByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { guild } = req.body;

      await deleteGuildById(guild);

      return res
        .status(200)
        .json({ message: 'Guild deleted successfully', guild });
    } catch (error) {
      next(error);
    }
  };
  return deleteGuildByIdEndpoint;
};
