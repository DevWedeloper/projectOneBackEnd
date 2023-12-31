import { Request, Response, NextFunction } from 'express';

const validAttributes = [
  'name',
  'characterType',
  'health',
  'strength',
  'agility',
  'intelligence',
  'armor',
  'critChance',
];

export const isValidAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { attribute } = req.params;
  if (!validAttributes.includes(attribute)) {
    return res
      .status(400)
      .json({
        error: 'Invalid attribute',
        message: `Attribute '${attribute}' is not valid`,
      });
  }
  next();
};
