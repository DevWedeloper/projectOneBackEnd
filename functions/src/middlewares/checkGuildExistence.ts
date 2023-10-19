import { Request, Response, NextFunction } from 'express';
import { Guild } from '../models/guildModel';

export const checkGuildExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const guild = await Guild.findById(id);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    req.body.guild = guild;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'An error occurred', message: error.message });
    }
  }
};
