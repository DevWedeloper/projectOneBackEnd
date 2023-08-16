import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RefreshToken, IRefreshAccessTokenDocument } from '../models/refreshAccessTokenModel';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;

    const existingRefreshToken: IRefreshAccessTokenDocument | null = await RefreshToken.findOne({ userId: decoded.userId, token: refreshToken });

    if (!existingRefreshToken) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, accessTokenSecret, { expiresIn: '5m' });

    res.json({ accessToken });
  } catch (error) {
    return res.sendStatus(403);
  }
};
