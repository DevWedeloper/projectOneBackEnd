import { Request, Response, NextFunction } from 'express';

export const errorHandler = async (
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  return res.status(500).json(error.message);
};
