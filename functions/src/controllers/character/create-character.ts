import { NextFunction, Request, Response } from 'express';
import { createCharacter } from '../../use-cases/types/character.type';

export const makeCreateCharacterEndpoint = ({
  createCharacter,
}: {
  createCharacter: createCharacter;
}) => {
  const createCharacterEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const character = await createCharacter(req.body);
      return res.status(201).json({
        message: 'Character created successfully',
        character,
      });
    } catch (error) {
      next(error);
    }
  };
  return createCharacterEndpoint;
};
