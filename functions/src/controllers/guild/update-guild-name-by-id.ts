import { NextFunction, Request, Response } from 'express';
import { updateGuildNameById } from '../../use-cases/types/guild.type';

export const makeUpdateGuildNameByIdEndpoint = ({
  updateGuildNameById,
}: {
  updateGuildNameById: updateGuildNameById;
}) => {
  const updateGuildNameByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const guild = await updateGuildNameById(id, name);
      return res.status(200).json({
        message: 'Guild name updated successfully',
        guild,
      });
    } catch (error) {
      next(error);
    }
  };
  return updateGuildNameByIdEndpoint;
};
