import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUserDocument } from '../models/userModel';
import {
  RefreshToken,
  IRefreshAccessTokenDocument,
} from '../models/refreshAccessTokenModel';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const login = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { username, password } = req.body;
  try {
    const user: IUserDocument | null = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Invalid credentials',
      });
    }

    let refreshTokenEntry: IRefreshAccessTokenDocument | null =
      await RefreshToken.findOne({ userId: user._id });
    if (!refreshTokenEntry) {
      const expiresInDays = process.env.REFRESH_TOKEN_EXPIRATION!;
      const expiresAt = new Date(
        Date.now() + parseInt(expiresInDays) * 24 * 60 * 60 * 1000
      );

      const refreshToken = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        refreshTokenSecret,
        {
          expiresIn: `${expiresInDays}`,
        }
      );

      refreshTokenEntry = new RefreshToken({
        userId: user._id,
        username: user.username,
        token: refreshToken,
        expiresAt: expiresAt,
      });

      await refreshTokenEntry.save();
    }

    const refreshTokenData = jwt.decode(refreshTokenEntry.token) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);

    if (refreshTokenData.exp! < currentTime) {
      const expiresInDays = process.env.REFRESH_TOKEN_EXPIRATION!;
      const expiresAt = new Date(
        Date.now() + parseInt(expiresInDays) * 24 * 60 * 60 * 1000
      );

      const newRefreshToken = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        refreshTokenSecret,
        {
          expiresIn: `${expiresInDays}`,
        }
      );

      refreshTokenEntry.token = newRefreshToken;
      refreshTokenEntry.expiresAt = expiresAt;
      await refreshTokenEntry.save();
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` }
    );

    return res.json({
      userId: user._id,
      accessToken,
      refreshToken: refreshTokenEntry.token,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to login', message: error.message });
    }
  }
};
