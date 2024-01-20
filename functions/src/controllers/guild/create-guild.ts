import { NextFunction, Request, Response } from 'express';
import { createGuild } from '../../use-cases/types/guild.type';

export const makeCreateGuildEndpoint = ({
  createGuild,
}: {
  createGuild: createGuild;
}) => {
  const createGuildEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { name, character } = req.body;

      const guild = await createGuild(name, character);
      return res
        .status(201)
        .json({ message: 'Guild created successfully', guild });
    } catch (error) {
      next(error);
    }
  };
  return createGuildEndpoint;
};
