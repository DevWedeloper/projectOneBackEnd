import { NextFunction, Request, Response } from 'express';
import { searchCharactersByName } from '../../use-cases/types/character.type';

export const makeSearchCharactersByNameEndpoint = ({
  searchCharactersByName,
}: {
  searchCharactersByName: searchCharactersByName;
}) => {
  const searchCharactersByNameEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const searchQuery = req.query.name as string;
      const limit = 10;

      const character = await searchCharactersByName(searchQuery, limit);
      return res.status(200).json(character);
    } catch (error) {
      next(error);
    }
  };
  return searchCharactersByNameEndpoint;
};
