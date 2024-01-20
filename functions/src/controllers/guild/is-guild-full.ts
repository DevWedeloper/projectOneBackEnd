import { NextFunction, Request, Response } from 'express';
import { isGuildFull } from '../../use-cases/types/guild.type';

export const makeIsGuildFullEndpoint = ({
  isGuildFull,
}: {
  isGuildFull: isGuildFull;
}) => {
  const isGuildFullEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { guild } = req.body;

      const status = isGuildFull(guild);
      return res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  };
  return isGuildFullEndpoint;
};
