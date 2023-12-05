import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import * as Guild from '../models/guildModel';

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

    const guildQuery = Types.ObjectId.isValid(guild)
      ? { _id: guild }
      : { name: guild };

    const foundGuild = await Guild.findOneByQuery(guildQuery);

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
