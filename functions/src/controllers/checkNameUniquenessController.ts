import { Request, Response } from 'express';
import { Character } from '../models/characterModel';
import { Guild } from '../models/guildModel';

export const isCharacterNameUnique = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { name } = req.body;
    const existingCharacter = await Character.findOne({ name });
    if (existingCharacter) {
      return res.status(422).json({ error: 'Character name is not unique' });
    }
    return res.status(200).json({ message: 'Character name is unique' });
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
    const existingGuild = await Guild.findOne({ name });
    if (existingGuild) {
      return res.status(422).json({ error: 'Guild name is not unique' });
    }
    return res.status(200).json({ message: 'Guild name is unique' });
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
