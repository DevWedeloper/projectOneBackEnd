import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as RefreshToken from '../models/refreshAccessTokenModel';
import * as User from '../models/userModel';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const login = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { username, password } = req.body;
  try {
    const user = await User.findOneByQuery({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Invalid credentials',
      });
    }

    let refreshTokenEntry = await RefreshToken.isUnique({
      userId: user._id.toString(),
    });
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

      refreshTokenEntry = await RefreshToken.create({
        userId: user._id.toString(),
        username: user.username,
        token: refreshToken,
        expiresAt: expiresAt,
      });
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

      await RefreshToken.updateById(refreshTokenEntry._id.toString(), {
        token: newRefreshToken,
        expiresAt: expiresAt,
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}` }
    );

    return res.status(201).json({
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
