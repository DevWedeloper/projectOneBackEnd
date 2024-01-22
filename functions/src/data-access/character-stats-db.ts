import { ICharacter } from '../types/character.type';
import { ValidStatsAttribute } from '../types/valid-stat-attribute.type';
import { CharacterModel } from './types/data-access.type';

export const makeCharacterStatsDb = ({
  Character,
}: {
  Character: CharacterModel;
}) => {
  const getTopCharactersByAttribute = async (
    attribute: ValidStatsAttribute,
    limit: number,
  ): Promise<ICharacter[]> => {
    return await Character.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          characterType: 1,
          [attribute]: { $sum: [`$${attribute}`] },
        },
      },
      {
        $sort: { [attribute]: -1 },
      },
      {
        $limit: Number(limit),
      },
    ]);
  };

  const getTopWellRoundedCharacters = async (
    limit: number,
  ): Promise<ICharacter[]> => {
    return await Character.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          characterType: 1,
          health: 1,
          strength: 1,
          agility: 1,
          intelligence: 1,
          armor: 1,
          critChance: 1,
          guild: 1,
          totalAttribute: {
            $sum: [
              { $divide: ['$health', 100] },
              '$strength',
              '$agility',
              '$intelligence',
              '$armor',
              { $multiply: ['$critChance', 100] },
            ],
          },
        },
      },
      {
        $sort: { totalAttribute: -1 },
      },
      {
        $limit: Number(limit),
      },
    ]);
  };

  const getAverageCharacterStats = async (): Promise<{
    avgHealth: number;
    avgStrength: number;
    avgAgility: number;
    avgIntelligence: number;
    avgArmor: number;
    avgCritChance: number;
  }> => {
    const [averageStats] = await Character.aggregate([
      {
        $group: {
          _id: null,
          avgHealth: { $avg: '$health' },
          avgStrength: { $avg: '$strength' },
          avgAgility: { $avg: '$agility' },
          avgIntelligence: { $avg: '$intelligence' },
          avgArmor: { $avg: '$armor' },
          avgCritChance: { $avg: '$critChance' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    return averageStats as {
      avgHealth: number;
      avgStrength: number;
      avgAgility: number;
      avgIntelligence: number;
      avgArmor: number;
      avgCritChance: number;
    };
  };

  const getCharacterDistributionByType = async (): Promise<ICharacter[]> => {
    return await Character.aggregate([
      {
        $group: {
          _id: '$characterType',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
  };

  return Object.freeze({
    getTopCharactersByAttribute,
    getTopWellRoundedCharacters,
    getAverageCharacterStats,
    getCharacterDistributionByType,
  });
};
