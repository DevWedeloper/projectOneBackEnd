import { NextFunction, Request, Response } from 'express';
import { CharacterService, GuildService } from '../use-cases';

export const isValidCharacter = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { character } = req.body;
    if (!character) {
      return next();
    }

    const foundCharacter =
      await CharacterService.getCharacterByNameOrId(character);
    req.body.character = foundCharacter;
    next();
  } catch (error) {
    next(error);
  }
};

export const isValidGuild = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { guild } = req.body;
    if (!guild) {
      return next();
    }

    const foundGuild = await GuildService.getGuildByNameOrId(guild);
    req.body.guild = foundGuild;
    next();
  } catch (error) {
    next(error);
  }
};
