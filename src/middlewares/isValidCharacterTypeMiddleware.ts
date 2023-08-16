import { Request, Response, NextFunction } from 'express';
import { CharacterType } from '../models/characterTypeModel';

export const isValidCharacterType = async (req: Request, res: Response, next: NextFunction) => {
  const { characterType } = req.body;
  if (!characterType) {
    return next();
  }

  try {
    const foundCharacterType = await CharacterType.findOne({ typeName: characterType });
    if (!foundCharacterType) {
      return res.status(500).json({ error: `Character type '${characterType}' does not exist.` });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate character type', message: error.message });
  }
};
