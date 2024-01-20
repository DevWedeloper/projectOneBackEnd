import { NextFunction, Request, Response } from 'express';
import { getTopWellRoundedCharacters } from '../../use-cases/types/character-stats.type';

export const makeGetTopWellRoundedCharactersEndpoint = ({
  getTopWellRoundedCharacters,
}: {
  getTopWellRoundedCharacters: getTopWellRoundedCharacters;
}) => {
  const getTopWellRoundedCharactersEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const limit = 5;
      const characters = await getTopWellRoundedCharacters(limit);
      return res.status(200).json(characters);
    } catch (error) {
      next(error);
    }
  };
  return getTopWellRoundedCharactersEndpoint;
};
