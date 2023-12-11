import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as RefreshToken from '../models/refreshAccessTokenModel';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: 'Unauthorized', message: 'Refresh token is missing.' });
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;
    await RefreshToken.findOneByQuery({
      userId: decoded.userId,
    });

    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
      accessTokenSecret,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` }
    );
    return res.status(201).json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to refresh token', message: error.message });
    }
  }
};
