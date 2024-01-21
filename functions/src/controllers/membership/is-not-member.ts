import { NextFunction, Request, Response } from 'express';
import { membershipStatus } from '../../use-cases/types/membership.type';

export const makeIsNotMemberEndpoint = ({
  isNotMember,
}: {
  isNotMember: membershipStatus;
}) => {
  const isNotMemberEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const { character, guild } = req.body;

      const message = isNotMember(character, guild);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };

  return isNotMemberEndpoint;
};
