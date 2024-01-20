import { NextFunction, Request, Response } from 'express';
import { CharacterService, GuildService } from '../use-cases';

export const checkCharacterExistence = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const character = await CharacterService.getCharacterById(id);
    req.body.character = character;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkGuildExistence = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const guild = await GuildService.getGuildById(id);
    req.body.guild = guild;
    next();
  } catch (error) {
    next(error);
  }
};
