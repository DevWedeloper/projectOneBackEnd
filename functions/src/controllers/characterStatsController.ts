import { Request, Response } from 'express';
import { Character } from '../models/characterModel';

export const getTopCharactersByAttribute = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { attribute } = req.params;
  try {
    const { limit = 5 } = req.query;

    const characters = await Character.aggregate([
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

    return res.json(characters);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: `Failed to retrieve characters with highest ${attribute}`,
          message: error.message,
        });
    }
  }
};

export const getTopWellRoundedCharacters = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { limit = 5 } = req.query;

    const characters = await Character.aggregate([
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

    return res.json(characters);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve well-rounded characters',
          message: error.message,
        });
    }
  }
};

export const getAverageCharacterStats = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const averageStats = await Character.aggregate([
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
    ]);

    if (averageStats.length === 0) {
      throw new Error('No characters found');
    }

    return res.json(averageStats[0]);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve average character stats',
          message: error.message,
        });
    }
  }
};

export const getCharacterDistributionByType = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const characterDistribution = await Character.aggregate([
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

    return res.json(characterDistribution);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve character distribution by type',
          message: error.message,
        });
    }
  }
};
