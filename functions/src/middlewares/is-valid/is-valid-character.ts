import { NextFunction, Request, Response } from 'express';
import { getCharacterByNameOrId } from '../../use-cases/types/character.type';

export const makeIsValidCharacterMiddleware = ({
  getCharacterByNameOrId,
}: {
  getCharacterByNameOrId: getCharacterByNameOrId;
}) => {
  const isValidCharacterMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { character } = req.body;
      if (!character) {
        return next();
      }

      const foundCharacter = await getCharacterByNameOrId(character);
      req.body.character = foundCharacter;
      next();
    } catch (error) {
      next(error);
    }
  };
  return isValidCharacterMiddleware;
};
