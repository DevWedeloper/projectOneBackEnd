import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const isAdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;

    req.user = decodedToken;

    if (req.user?.role === 'standard' && req.method !== 'GET') {
      return res.status(403).json({ message: 'Standard users cannot perform this action.' });
    }

    next();
  } catch (error) {
    console.log('Error:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
