import { NextFunction, Request, Response } from 'express';
import {
  ForbiddenError,
  InvalidOperationError,
  InvalidPropertyError,
  NotFoundError,
  RequiredParameterError,
  UnauthorizedError,
  UniqueConstraintError,
} from '../utils/errors';

export const errorHandler = async (
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  if (error instanceof RequiredParameterError) {
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof InvalidPropertyError) {
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message });
  }
  if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ error: error.message });
  }
  if (error instanceof InvalidOperationError) {
    return res.status(422).json({ error: error.message });
  }
  return res.status(500).json({ error: error.message });
};
