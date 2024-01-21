import { NextFunction, Request, Response } from 'express';
import { searchGuildsByName } from '../../use-cases/types/guild.type';

export const makeSearchGuildsByNameEndpoint = ({
  searchGuildsByName,
}: {
  searchGuildsByName: searchGuildsByName;
}) => {
  const searchGuildsByNameEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const searchQuery = req.query.name as string;
      const limit = 10;

      const guild = await searchGuildsByName(searchQuery, limit);
      return res.status(200).json(guild);
    } catch (error) {
      next(error);
    }
  };
  return searchGuildsByNameEndpoint;
};
