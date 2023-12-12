import { Request, Response } from 'express';
import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';

export const isCharacterNameUnique = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { name } = req.body;
    const existingCharacter = await Character.isUnique({ name });
    if (existingCharacter) {
      return res.status(200).json({ message: 'Character name is not unique' });
    } else {
      return res.status(200).json({ message: 'Character name is unique' });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to validate character name uniqueness',
          message: error.message,
        });
    }
  }
};

export const isGuildNameUnique = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { name } = req.body;
    const existingGuild = await Guild.isUnique({ name });
    if (existingGuild) {
      return res.status(200).json({ message: 'Guild name is not unique' });
    } else {
      return res.status(200).json({ message: 'Guild name is unique' });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to validate guild name uniqueness',
          message: error.message,
        });
    }
  }
};
