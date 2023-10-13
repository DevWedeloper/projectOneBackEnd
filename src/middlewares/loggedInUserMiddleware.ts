import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  authUserId: string;
  authRole: 'admin' | 'standard';
}

export const loggedInUserMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    req.authUserId = decodedToken.userId;
    req.authRole = decodedToken.role;
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};