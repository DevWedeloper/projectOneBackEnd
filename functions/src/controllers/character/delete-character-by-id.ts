import { NextFunction, Request, Response } from 'express';
import { deleteCharacterById } from '../../use-cases/types/character.type';

export const makeDeleteCharacterByIdEndpoint = ({
  deleteCharacterById,
}: {
  deleteCharacterById: deleteCharacterById;
}) => {
  const deleteCharacterByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { character } = req.body;

      const deletedCharacter = await deleteCharacterById(id, character);
      return res.status(200).json({
        message: 'Character deleted successfully.',
        character: deletedCharacter,
      });
    } catch (error) {
      next(error);
    }
  };
  return deleteCharacterByIdEndpoint;
};
