import { NextFunction, Request, Response } from 'express';
import { isAdmin } from '../use-cases/types/is-admin.type';

export const makeIsAdminMiddleware = ({ isAdmin }: { isAdmin: isAdmin }) => {
  const isAdminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const token = req.cookies.accessToken;

      isAdmin(token, req.method);
      next();
    } catch (error) {
      return next(error);
    }
  };
  return isAdminMiddleware;
};
