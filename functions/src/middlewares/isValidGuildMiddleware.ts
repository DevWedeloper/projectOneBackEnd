import { NextFunction, Request, Response } from 'express';
import * as Guild from '../models/guildModel';
import { isValidObject } from '../models/isValidObjectModel';

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
