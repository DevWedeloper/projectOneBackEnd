import { Request, Response } from 'express';
import { CharacterType } from '../models/characterTypeModel';

export const getCharacterTypes = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const characterTypes = await CharacterType.find().sort({ typeName: 1 });
    return res.json(characterTypes);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'An error occurred while fetching character types.',
          message: error.message,
        });
    }
  }
};
