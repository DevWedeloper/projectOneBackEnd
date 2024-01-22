import { NextFunction, Request, Response } from 'express';
import { getCharacterById } from '../../use-cases/types/character.type';

export const makeCheckCharacterExistenceMiddleware = ({
  getCharacterById,
}: {
  getCharacterById: getCharacterById;
}) => {
  const checkCharacterExistenceMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      const character = await getCharacterById(id);
      req.body.character = character;
      next();
    } catch (error) {
      next(error);
    }
  };
  return checkCharacterExistenceMiddleware;
};
