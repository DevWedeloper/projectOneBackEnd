import { NextFunction, Request, Response } from 'express';
import { deleteAllCharacters } from '../../use-cases/types/character.type';

export const makeDeleteAllCharactersEndpoint = ({
  deleteAllCharacters,
}: {
  deleteAllCharacters: deleteAllCharacters;
}) => {
  const deleteAllCharactersEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { characterDeletionResult, guildDeletionResult } =
        await deleteAllCharacters();
      return res.status(200).json({
        message: `${characterDeletionResult.deletedCount} 
        characters and ${guildDeletionResult.deletedCount} guilds deleted successfully.`,
      });
    } catch (error) {
      next(error);
    }
  };
  return deleteAllCharactersEndpoint;
};
