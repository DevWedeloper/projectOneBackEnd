import { Request, Response, NextFunction } from 'express';
import * as CharacterType from '../models/characterTypeModel';

export const isValidCharacterType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { characterType } = req.body;
  if (!characterType) {
    return next();
  }

  try {
    const foundCharacterType = await CharacterType.findOne(characterType);
    if (!foundCharacterType) {
      return res
        .status(500)
        .json({ error: `Character type '${characterType}' does not exist.` });
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to validate character type',
        message: error.message,
      });
    }
  }
};
