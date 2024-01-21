import { NextFunction, Request, Response } from 'express';
import { removeMemberFromGuildById } from '../../use-cases/types/guild.type';

export const makeRemoveMemberFromGuildByIdEndpoint = ({
  removeMemberFromGuildById,
}: {
  removeMemberFromGuildById: removeMemberFromGuildById;
}) => {
  const removeMemberFromGuildByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { guild, character } = req.body;

      const updatedGuild = await removeMemberFromGuildById(
        id,
        guild,
        character,
      );
      return res.status(200).json({
        message: 'Member removed from guild successfully',
        guild: updatedGuild,
      });
    } catch (error) {
      next(error);
    }
  };
  return removeMemberFromGuildByIdEndpoint;
};
