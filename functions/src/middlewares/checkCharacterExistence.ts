import { Request, Response, NextFunction } from 'express';
import * as Character from '../models/characterModel';

export const checkCharacterExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    req.body.character = character;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'An error occurred', message: error.message });
    }
  }
};
