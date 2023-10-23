import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ICharacterDocument, Character } from '../models/characterModel';

export const isValidCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { character } = req.body;
  if (!character) {
    return next();
  }

  try {
    const isValidObjectId = Types.ObjectId.isValid(character);
    if (isValidObjectId) {
      const foundCharacter: ICharacterDocument | null = await Character.findById(character);
      if (foundCharacter) {
        req.body.character = foundCharacter._id;
      }
    } else {
      const foundCharacterByName: ICharacterDocument | null = await Character.findOne({
        name: character,
      });
      if (!foundCharacterByName) {
        return res
          .status(500)
          .json({ error: `Character '${character}' does not exist.` });
      } else {
        req.body.character = foundCharacterByName._id;
      }
    }
    

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to validate character', message: error.message });
    }
  }
};
