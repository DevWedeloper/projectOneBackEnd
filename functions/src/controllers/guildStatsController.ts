import { Request, Response } from 'express';
import { Guild } from '../models/guildModel';
import * as GuildModel from '../models/guildModel';

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

    const topGuilds = await GuildModel.getTopGuildsByAttribute(attribute, limit);
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
    const { limit = 5 } = req.query;

    const guilds = await Guild.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          membersAverage: {
            $cond: {
              if: { $ne: ['$totalMembers', 0] },
              then: {
                $divide: [
                  {
                    $sum: [
                      { $divide: ['$totalHealth', 100] }, 
                      '$totalStrength',
                      '$totalAgility',
                      '$totalIntelligence',
                      '$totalArmor',
                      { $multiply: ['$totalCritChance', 100] },
                    ],
                  },
                  '$totalMembers',
                ],
              },
              else: 0,
            },
          },
        },
      },
      {
        $sort: { membersAverage: -1 },
      },
      {
        $limit: Number(limit),
      },
    ]);

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
    const { limit = 5 } = req.query;

    const actualAttribute = attributeMapping[attribute];
    if (!actualAttribute) {
      return res.status(400).json({
        error: 'Invalid attribute',
        message: `Attribute "${attribute}" is not supported.`,
      });
    }

    const topGuilds = await Guild.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          averageAttribute: { $divide: [`$${actualAttribute}`, '$totalMembers'] },
        },
      },
      {
        $sort: { averageAttribute: -1 },
      },
      {
        $limit: Number(limit),
      },
    ]);

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
