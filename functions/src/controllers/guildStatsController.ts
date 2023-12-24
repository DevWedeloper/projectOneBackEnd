import { Request, Response, NextFunction } from 'express';
import * as Guild from '../models/guildStatsModel';

export const getTopGuildsByAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { attribute } = req.params;

    const limit = 5;
    const actualAttribute = attributeMapping[attribute];
    if (!actualAttribute) {
      return res.status(400).json({
        error: 'Invalid attribute',
        message: `Attribute "${attribute}" is not supported.`,
      });
    }

    const topGuilds = await Guild.getTopGuildsByAttribute(
      actualAttribute,
      limit
    );
    return res.json(topGuilds);
  } catch (error) {
    next(error);
  }
};

export const getTopWellRoundedGuilds = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const limit = 5;

    const guilds = await Guild.getTopWellRoundedGuilds(limit);
    return res.json(guilds);
  } catch (error) {
    next(error);
  }
};

export const getTopGuildsByAverageAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { attribute } = req.params;

    const limit = 5;
    const actualAttribute = attributeMapping[attribute];
    if (!actualAttribute) {
      return res.status(400).json({
        error: 'Invalid attribute',
        message: `Attribute "${attribute}" is not supported.`,
      });
    }

    const topGuilds = await Guild.getTopGuildsByAverageAttribute(
      actualAttribute,
      limit
    );
    return res.json(topGuilds);
  } catch (error) {
    next(error);
  }
};

const attributeMapping: { [key: string]: string } = {
  health: 'totalHealth',
  strength: 'totalStrength',
  agility: 'totalAgility',
  intelligence: 'totalIntelligence',
  armor: 'totalArmor',
  critChance: 'totalCritChance',
};
