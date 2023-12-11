import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RefreshToken } from '../models/refreshAccessTokenModel';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Refresh token is missing.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;

    const existingRefreshToken = await RefreshToken.findOne({
      userId: decoded.userId,
      token: refreshToken,
    });

    if (!existingRefreshToken) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid or expired refresh token.',
      });
    }

    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
      accessTokenSecret,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` }
    );

    return res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to refresh token', message: error.message });
    }
  }
};
