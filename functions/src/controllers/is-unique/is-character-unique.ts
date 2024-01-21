import { NextFunction, Request, Response } from 'express';
import { isCharacterNameUnique } from '../../use-cases/types/is-unique.type';

export const makeIsCharacterNameUniqueEndpoint = ({
  isCharacterNameUnique,
}: {
  isCharacterNameUnique: isCharacterNameUnique;
}) => {
  const isCharacterNameUniqueEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { name } = req.body;
      const message = await isCharacterNameUnique(name);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
  return isCharacterNameUniqueEndpoint;
};
