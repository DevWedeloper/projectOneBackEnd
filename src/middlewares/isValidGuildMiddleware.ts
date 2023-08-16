import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IGuildDocument, Guild } from '../models/guildModel';

export const isValidGuild = async (req: Request, res: Response, next: NextFunction) => {
  const { guild } = req.body;
  if (!guild) {
    return next();
  }

  try {
    const isValidObjectId = Types.ObjectId.isValid(guild);
    if (isValidObjectId) {
      const foundGuild: IGuildDocument | null = await Guild.findById(guild);
      if (foundGuild) {
        req.body.guild = foundGuild._id;
      }
    }
    const foundGuildByName: IGuildDocument | null = await Guild.findOne({ name: guild });
    if (!foundGuildByName) {
      return res.status(500).json({ error: `Guild '${guild}' does not exist.` });
    } else {
      req.body.guild = foundGuildByName._id;
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate guild', message: error.message });
  }
};
