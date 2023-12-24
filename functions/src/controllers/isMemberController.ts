import { Request, Response, NextFunction } from 'express';
import { isValidObject } from '../models/isValidObjectModel';
import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';

export const isMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { character, guild } = req.body;
    const characterQuery = isValidObject(character)
      ? { _id: character }
      : { name: character };
    const guildQuery = isValidObject(guild) ? { _id: guild } : { name: guild };
    const foundCharacter = await Character.isExisting(characterQuery);
    const foundGuild = await Guild.findOneByNameOrId(guildQuery);
    if (!foundCharacter) {
      return res.status(200).json({ message: 'Member' });
    }
    if (foundCharacter?.guild?._id.toString() === foundGuild._id.toString()) {
      return res.status(200).json({ message: 'Member' });
    }
    if (foundCharacter?.guild?._id.toString() !== foundGuild._id.toString()) {
      return res.status(200).json({ message: 'Not member' });
    }
    return res
      .status(400)
      .json({ message: 'Invalid request. Member status not determined.' });
  } catch (error) {
    next(error);
  }
};

export const isNotMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { character, guild } = req.body;
    const characterQuery = isValidObject(character)
      ? { _id: character }
      : { name: character };
    const guildQuery = isValidObject(guild) ? { _id: guild } : { name: guild };
    const foundCharacter = await Character.isExisting(characterQuery);
    const foundGuild = await Guild.findOneByNameOrId(guildQuery);
    if (!foundCharacter) {
      return res.status(200).json({ message: 'Not member' });
    }
    if (foundCharacter?.guild?._id.toString() !== foundGuild._id.toString()) {
      return res.status(200).json({ message: 'Not member' });
    }
    if (foundCharacter?.guild?._id.toString() === foundGuild._id.toString()) {
      return res.status(200).json({ message: 'Member' });
    }
    return res
      .status(400)
      .json({ message: 'Invalid request. Member status not determined.' });
  } catch (error) {
    next(error);
  }
};
