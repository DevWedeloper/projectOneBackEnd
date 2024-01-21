import { NextFunction, Request, Response } from 'express';
import { checkGuildRelation } from '../../use-cases/types/character.type';

export const makeCheckGuildRelationStatusEndpoint = ({
  checkGuildRelation,
}: {
  checkGuildRelation: checkGuildRelation;
}) => {
  const checkGuildRelationStatusEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { character } = req.body;

      const status = checkGuildRelation(character);
      return res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  };
  return checkGuildRelationStatusEndpoint;
};
