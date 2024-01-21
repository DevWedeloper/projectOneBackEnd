import { NextFunction, Request, Response } from 'express';
import { getCharacterById } from '../../use-cases/types/character.type';

export const makeGetCharacterByIdEndpoint = ({
  getCharacterById,
}: {
  getCharacterById: getCharacterById;
}) => {
  const getCharacterByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      const character = await getCharacterById(id);
      return res.status(200).json(character);
    } catch (error) {
      next(error);
    }
  };
  return getCharacterByIdEndpoint;
};
