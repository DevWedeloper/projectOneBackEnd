import { NextFunction, Request, Response } from 'express';
import { isAdmin } from '../use-cases';

export const isAdminMiddleware = async (
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
