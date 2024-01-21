import { NextFunction, Request, Response } from 'express';
import { getAllCharacterTypes } from '../../use-cases/types/character-types.type';

export const makeGetAllCharacterTypesEndpoint = ({
  getAllCharacterTypes,
}: {
  getAllCharacterTypes: getAllCharacterTypes;
}) => {
  const getCharacterTypesEndpoint = async (
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const characterTypes = await getAllCharacterTypes();
      return res.json(characterTypes);
    } catch (error) {
      next(error);
    }
  };
  return getCharacterTypesEndpoint;
};
