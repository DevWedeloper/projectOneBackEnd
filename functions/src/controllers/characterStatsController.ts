import { Request, Response, NextFunction } from 'express';
import * as Character from '../models/characterStatsModel';

export const getTopCharactersByAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { attribute } = req.params;
  try {
    const limit = 5;
    const characters = await Character.getTopCharactersByAttribute(
      attribute,
      limit
    );
    return res.status(200).json(characters);
  } catch (error) {
    next(error);
  }
};

export const getTopWellRoundedCharacters = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const limit = 5;
    const characters = await Character.getTopWellRoundedCharacters(limit);
    return res.status(200).json(characters);
  } catch (error) {
    next(error);
  }
};

export const getAverageCharacterStats = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const averageStats = await Character.getAverageCharacterStats();
    return res.status(200).json(averageStats);
  } catch (error) {
    next(error);
  }
};

export const getCharacterDistributionByType = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const characterDistribution =
      await Character.getCharacterDistributionByType();
    return res.status(200).json(characterDistribution);
  } catch (error) {
    next(error);
  }
};
