import { NextFunction, Request, Response } from 'express';
import { CharacterTypeService } from '../use-cases';

export const isValidCharacterType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { characterType } = req.body;
    
    if (!characterType) {
      return next();
    }

    await CharacterTypeService.getCharacterType(characterType);
    next();
  } catch (error) {
    next(error);
  }
};
