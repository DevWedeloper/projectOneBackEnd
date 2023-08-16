import { Request, Response, NextFunction } from 'express';
import { Character, ICharacterDocument } from '../models/characterModel';

interface checkCharacter extends Request {
  character: ICharacterDocument;
}

export const checkCharacterExistence = async (req: checkCharacter, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    req.body.character = character;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred', message: error.message });
  }
};
