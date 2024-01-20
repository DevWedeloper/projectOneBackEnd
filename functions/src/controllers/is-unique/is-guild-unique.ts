import { NextFunction, Request, Response } from 'express';
import { isGuildNameUnique } from '../../use-cases/types/is-unique.type';

export const makeIsGuildNameUniqueEndpoint = ({
  isGuildNameUnique,
}: {
  isGuildNameUnique: isGuildNameUnique;
}) => {
  const isGuildNameUniqueEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { name } = req.body;
      const message = await isGuildNameUnique(name);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
  return isGuildNameUniqueEndpoint;
};
