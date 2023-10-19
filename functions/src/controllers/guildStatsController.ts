import { Request, Response } from 'express';
import { Guild } from '../models/guildModel';

export async function getTopGuildsByAttribute(req: Request, res: Response) {
  try {
    const { attribute } = req.params;
    const { limit = 5 } = req.query;

    const projection: any = {
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
          combinedAttribute: attribute === 'critChance' ? { $avg: '$critChances' } : '$combinedAttribute',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalMembers: 1,
          combinedAttribute: attribute === 'critChance' ? { $round: ['$combinedAttribute', 2] } : '$combinedAttribute',
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
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve top guilds by attribute', message: error.message });
  }
}

export async function getTopWellRoundedGuilds(req: Request, res: Response) {
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
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve top well-rounded guilds', message: error.message });
  }
}

export async function getTopGuildsByAverageAttribute(req: Request, res: Response) {
  try {
    const { attribute } = req.params;
    const { limit = 5 } = req.query;
  
    const projection: any = {
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
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve top guilds by average attribute', message: error.message });
  }
}
