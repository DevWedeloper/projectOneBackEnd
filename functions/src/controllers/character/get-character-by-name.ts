import { NextFunction, Request, Response } from 'express';
import { getCharacterByName } from '../../use-cases/types/character.type';

export const makeGetCharacterByNameEndpoint = ({
  getCharacterByName,
}: {
  getCharacterByName: getCharacterByName;
}) => {
  const getCharacterByNameEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { name } = req.params;

      const character = await getCharacterByName(name);
      return res.status(200).json(character);
    } catch (error) {
      next(error);
    }
  };
  return getCharacterByNameEndpoint;
};
