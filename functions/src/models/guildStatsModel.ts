import { IGuild } from '../types/guildTypes';
import { Guild } from './schemas/guildSchema';

export const getTopGuildsByAttribute = async (
  attribute: string,
  limit: number
): Promise<IGuild[]> => {
  return await Guild.find()
    .sort({ [attribute]: -1 })
    .limit(Number(limit))
    .select(`_id name ${attribute}`);
};

type WellRoundedGuild = IGuild & {
  membersAverage: number;
};

export const getTopWellRoundedGuilds = async (
  limit: number
): Promise<WellRoundedGuild[]> => {
  return await Guild.aggregate([
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
};

type TopByAverageAttributeGuild = IGuild & {
  averageAttribute: number;
};

export const getTopGuildsByAverageAttribute = async (
  attribute: string,
  limit: number
): Promise<TopByAverageAttributeGuild[]> => {
  return await Guild.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        averageAttribute: { $divide: [`$${attribute}`, '$totalMembers'] },
      },
    },
    {
      $sort: { averageAttribute: -1 },
    },
    {
      $limit: Number(limit),
    },
  ]);
};
