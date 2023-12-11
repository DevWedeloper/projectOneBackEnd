import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  authUserId: string;
  authRole: 'admin' | 'standard';
}

export const loggedInUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authReq = req as AuthRequest;
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    authReq.authUserId = decodedToken.userId;
    authReq.authRole = decodedToken.role;

    next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
