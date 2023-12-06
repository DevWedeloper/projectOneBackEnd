import { Request, Response, NextFunction } from 'express';
import * as CharacterType from '../models/characterTypeModel';

export const isValidCharacterType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { characterType } = req.body;
    
    await CharacterType.findOne(characterType);
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
