import { NextFunction, Request, Response } from 'express';
import { joinGuildById } from '../../use-cases/types/character.type';

export const makeJoinGuildByIdEndpoint = ({
  joinGuildById,
}: {
  joinGuildById: joinGuildById;
}) => {
  const joinGuildByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { character, guild } = req.body;

      const updatedCharacter = await joinGuildById(id, character, guild);
      return res.status(200).json({
        message: 'Joined guild successfully.',
        character: updatedCharacter,
      });
    } catch (error) {
      next(error);
    }
  };
  return joinGuildByIdEndpoint;
};
