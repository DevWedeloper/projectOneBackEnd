import { Request, Response, NextFunction } from 'express';
import * as Guild from '../models/guildModel';

export const checkGuildExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    
    const guild = await Guild.findById(id);
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
