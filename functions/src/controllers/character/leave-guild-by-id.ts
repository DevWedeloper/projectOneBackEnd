import { NextFunction, Request, Response } from 'express';
import { leaveGuildById } from '../../use-cases/types/character.type';

export const makeLeaveGuildByIdEndpoint = ({
  leaveGuildById,
}: {
  leaveGuildById: leaveGuildById;
}) => {
  const leaveGuildByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { character } = req.body;

      const updatedCharacter = await leaveGuildById(id, character);
      return res.status(200).json({
        message: 'Left guild successfully.',
        character: updatedCharacter,
      });
    } catch (error) {
      next(error);
    }
  };
  return leaveGuildByIdEndpoint;
};
