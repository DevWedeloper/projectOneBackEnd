import { Request, Response, NextFunction } from 'express';
import * as CharacterType from '../models/characterTypeModel';

export const getCharacterTypes = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const characterTypes = await CharacterType.getAll();
    return res.json(characterTypes);
  } catch (error) {
    next(error);
  }
};
