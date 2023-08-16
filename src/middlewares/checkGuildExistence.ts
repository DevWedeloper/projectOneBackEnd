import { Request, Response, NextFunction } from 'express';
import { Guild, IGuildDocument } from '../models/guildModel';

interface checkGuild extends Request {
  guild: IGuildDocument;
}

export const checkGuildExistence = async (req: checkGuild, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const guild = await Guild.findById(id);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    req.body.guild = guild;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred', message: error.message });
  }
};
