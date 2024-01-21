import { NextFunction, Request, Response } from 'express';
import { deleteAllGuilds } from '../../use-cases/types/guild.type';

export const makeDeleteAllGuildsEndpoint = ({
  deleteAllGuilds,
}: {
  deleteAllGuilds: deleteAllGuilds;
}) => {
  const deleteAllGuildsEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const result = await deleteAllGuilds();

      return res.status(200).json({
        message: `${result.deletedCount} guilds deleted successfully.`,
      });
    } catch (error) {
      next(error);
    }
  };
  return deleteAllGuildsEndpoint;
};
