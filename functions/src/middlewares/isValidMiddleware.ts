import { NextFunction, Request, Response } from 'express';
import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';
import { isValidObject } from '../models/isValidObjectModel';

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

    const characterQuery = isValidObject(character)
      ? { _id: character }
      : { name: character };

    const foundCharacter = await Character.findOneByNameOrId(characterQuery);
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

export const isValidGuild = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { guild } = req.body;
    if (!guild) {
      return next();
    }

    const guildQuery = isValidObject(guild)
      ? { _id: guild }
      : { name: guild };

    const foundGuild = await Guild.findOneByNameOrId(guildQuery);
    req.body.guild = foundGuild;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to validate guild', message: error.message });
    }
  }
};
