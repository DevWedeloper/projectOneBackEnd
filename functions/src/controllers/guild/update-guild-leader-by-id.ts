import { NextFunction, Request, Response } from 'express';
import { updateGuildLeaderById } from '../../use-cases/types/guild.type';

export const makeUpdateGuildLeaderByIdEndpoint = ({
  updateGuildLeaderById,
}: {
  updateGuildLeaderById: updateGuildLeaderById;
}) => {
  const updateGuildLeaderByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { guild, character } = req.body;

      const updatedGuild = await updateGuildLeaderById(id, guild, character);
      return res.status(200).json({
        message: 'Guild leader updated successfully',
        guild: updatedGuild,
      });
    } catch (error) {
      next(error);
    }
  };
  return updateGuildLeaderByIdEndpoint;
};
