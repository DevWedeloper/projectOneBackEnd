import { NextFunction, Request, Response } from 'express';
import { membershipStatus } from '../../use-cases/types/membership.type';

export const makeIsMemberEndpoint = ({
  isMember,
}: {
  isMember: membershipStatus;
}) => {
  const isMemberEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { character, guild } = req.body;

      const message = isMember(character, guild);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
  return isMemberEndpoint;
};
