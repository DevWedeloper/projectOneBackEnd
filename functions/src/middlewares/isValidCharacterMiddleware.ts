import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Character } from '../models/characterModel';

export const isValidCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { character } = req.body;
    if (!character) {
      return next();
    }

    const characterQuery = Types.ObjectId.isValid(character)
      ? { _id: character }
      : { name: character };

    const foundCharacter = await Character.findOne(characterQuery)
      .populate({
        path: 'guild',
        select: '_id name leader',
        populate: {
          path: 'leader',
          model: 'Character',
          select: '_id name',
        },
      });

    if (!foundCharacter) {
      return res.status(500).json({ error: `Character '${character}' does not exist.` });
    }

    req.body.character = foundCharacter;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to validate character', message: error.message });
    }
  }
};
