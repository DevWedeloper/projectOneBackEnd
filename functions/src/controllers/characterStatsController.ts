import { Request, Response } from 'express';
import * as CharacterModel from '../models/characterModel';
import { Character } from '../models/characterModel';

export const getTopCharactersByAttribute = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { attribute } = req.params;
  try {
    const limit = 5;
    const characters = await CharacterModel.getTopCharactersByAttribute(
      attribute,
      limit
    );
    return res.status(200).json(characters);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
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
    const limit = 5;
    const characters = await CharacterModel.getTopWellRoundedCharacters(limit);
    return res.json(characters);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
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
    const averageStats = await CharacterModel.getAverageCharacterStats();
    return res.json(averageStats);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
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
      return res.status(500).json({
        error: 'Failed to retrieve character distribution by type',
        message: error.message,
      });
    }
  }
};
