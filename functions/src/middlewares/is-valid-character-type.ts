import { NextFunction, Request, Response } from 'express';
import { getCharacterType } from '../use-cases/types/character-types.type';

export const makeIsValidCharacterTypeMiddleware = ({
  getCharacterType,
}: {
  getCharacterType: getCharacterType;
}) => {
  const isValidCharacterTypeMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { characterType } = req.body;

      if (!characterType) {
        return next();
      }

      await getCharacterType(characterType);
      next();
    } catch (error) {
      next(error);
    }
  };
  return isValidCharacterTypeMiddleware;
};
