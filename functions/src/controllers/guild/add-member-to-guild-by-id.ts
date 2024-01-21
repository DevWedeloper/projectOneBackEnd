import { NextFunction, Request, Response } from 'express';
import { addMemberToGuildById } from '../../use-cases/types/guild.type';

export const makeAddMemberToGuildByIdEndpoint = ({
  addMemberToGuildById,
}: {
  addMemberToGuildById: addMemberToGuildById;
}) => {
  const addMemberToGuildByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { guild, character } = req.body;

      const updatedGuild = await addMemberToGuildById(id, guild, character);
      return res.status(200).json({
        message: 'Member added to guild successfully',
        guild: updatedGuild,
      });
    } catch (error) {
      next(error);
    }
  };
  return addMemberToGuildByIdEndpoint;
};
