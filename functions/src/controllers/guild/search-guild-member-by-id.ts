import { NextFunction, Request, Response } from 'express';
import { searchGuildMemberById } from '../../use-cases/types/guild.type';

export const makeSearchGuildMemberByIdEndpoint = ({
  searchGuildMemberById,
}: {
  searchGuildMemberById: searchGuildMemberById;
}) => {
  const searchGuildMemberByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const searchQuery = req.query.name as string;
      const limit = 10;
      const { guild } = req.body;

      const members = await searchGuildMemberById(guild, searchQuery, limit);
      return res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  };
  return searchGuildMemberByIdEndpoint;
};
