import { NextFunction, Request, Response } from 'express';
import { getPaginatedGuilds } from '../../use-cases/types/guild.type';

export const makeGetPaginatedGuildsEndpoint = ({
  getPaginatedGuilds,
}: {
  getPaginatedGuilds: getPaginatedGuilds;
}) => {
  const getAllGuildsPaginatedEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const page: number = parseInt(req.query.page as string) || 1;
      const pageSize: number = parseInt(req.query.pageSize as string) || 10;
      const sortBy: string = (req.query.sortBy as string) || 'name';
      const sortOrder: 'asc' | 'desc' =
        (req.query.sortOrder as 'asc' | 'desc') || 'asc';
      const searchQuery: string = (req.query.search as string) || '';

      const guilds = await getPaginatedGuilds(
        page,
        pageSize,
        sortBy,
        sortOrder,
        searchQuery
      );
      return res.status(200).json(guilds);
    } catch (error) {
      next(error);
    }
  };
  return getAllGuildsPaginatedEndpoint;
};
