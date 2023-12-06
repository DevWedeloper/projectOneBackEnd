import { Request, Response } from 'express';
import * as Guild from '../models/guildStatsModel';

export const getTopGuildsByAttribute = async (
  req: Request,
  res: Response
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

    const topGuilds = await Guild.getTopGuildsByAttribute(actualAttribute, limit);
    return res.json(topGuilds);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve top guilds by attribute',
          message: error.message,
        });
    }
  }
};

export const getTopWellRoundedGuilds = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const limit = 5;

    const guilds = await Guild.getTopWellRoundedGuilds(limit);
    return res.json(guilds);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve top well-rounded guilds',
          message: error.message,
        });
    }
  }
};

export const getTopGuildsByAverageAttribute = async (
  req: Request,
  res: Response
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

    const topGuilds = await Guild.getTopGuildsByAverageAttribute(actualAttribute, limit);
    return res.json(topGuilds);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve top guilds by average attribute',
          message: error.message,
        });
    }
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
