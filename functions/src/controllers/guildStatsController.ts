import { Request, Response } from 'express';
import { Guild } from '../models/guildModel';

export const getTopGuildsByAttribute = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { attribute } = req.params;
    const { limit = 5 } = req.query;

    interface Projection {
      _id: number;
      name: number;
      totalMembers: number;
      critChances?: string;
      combinedAttribute?: { $sum: string };
    }

    const projection: Projection = {
      _id: 1,
      name: 1,
      totalMembers: 1,
    };

    if (attribute === 'critChance') {
      projection.critChances = '$members.critChance';
    } else {
      projection.combinedAttribute = { $sum: `$members.${attribute}` };
    }

    const topGuilds = await Guild.aggregate([
      {
        $lookup: {
          from: 'characters',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $project: projection,
      },
      {
        $addFields: {
          combinedAttribute:
            attribute === 'critChance'
              ? { $avg: '$critChances' }
              : '$combinedAttribute',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalMembers: 1,
          combinedAttribute:
            attribute === 'critChance'
              ? { $round: ['$combinedAttribute', 2] }
              : '$combinedAttribute',
        },
      },
      {
        $sort: { combinedAttribute: -1 },
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
  const { limit = 5 } = req.query;

  try {
    const guilds = await Guild.aggregate([
      {
        $lookup: {
          from: 'characters',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $addFields: {
          membersAttributes: {
            $map: {
              input: '$members',
              as: 'member',
              in: {
                health: { $divide: ['$$member.health', 100] },
                strength: '$$member.strength',
                agility: '$$member.agility',
                intelligence: '$$member.intelligence',
                armor: '$$member.armor',
                critChance: { $multiply: ['$$member.critChance', 100] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalAttributes: {
            $sum: [
              { $sum: '$membersAttributes.health' },
              { $sum: '$membersAttributes.strength' },
              { $sum: '$membersAttributes.agility' },
              { $sum: '$membersAttributes.intelligence' },
              { $sum: '$membersAttributes.armor' },
              { $sum: '$membersAttributes.critChance' },
            ],
          },
        },
      },
      {
        $addFields: {
          membersAverage: {
            $cond: {
              if: { $ne: [{ $size: '$members' }, 0] },
              then: { $divide: ['$totalAttributes', { $size: '$members' }] },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalMembers: { $size: '$members' },
          membersAverage: { $round: ['$membersAverage', 2] },
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

    interface Projection {
      _id: number;
      name: number;
      totalMembers: number;
      averageAttribute?: {
        $round: (number | { $avg: string })[];
      };
    }

    const projection: Projection = {
      _id: 1,
      name: 1,
      totalMembers: 1,
      averageAttribute: { $round: [{ $avg: `$members.${attribute}` }, 2] },
    };

    const topGuilds = await Guild.aggregate([
      {
        $lookup: {
          from: 'characters',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $project: projection,
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
