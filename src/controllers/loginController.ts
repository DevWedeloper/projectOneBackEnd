import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUserDocument } from '../models/userModel';
import { RefreshToken, IRefreshAccessTokenDocument } from '../models/refreshAccessTokenModel';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const user: IUserDocument | null = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let refreshTokenEntry: IRefreshAccessTokenDocument | null = await RefreshToken.findOne({ userId: user._id });

    if (!refreshTokenEntry) {
      const expiresInDays = 1;
      const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

      const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, {
        expiresIn: `${expiresInDays}d`,
      });

      refreshTokenEntry = new RefreshToken({
        userId: user._id,
        username: user.username,
        token: refreshToken,
        expiresAt: expiresAt,
      });

      await refreshTokenEntry.save();
    } else {
      const refreshTokenData: any = jwt.decode(refreshTokenEntry.token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (refreshTokenData.exp < currentTime) {
        const expiresInDays = 1;
        const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  
        const newRefreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, {
          expiresIn: `${expiresInDays}d`,
        });

        refreshTokenEntry.token = newRefreshToken;
        refreshTokenEntry.expiresAt = expiresAt;
        await refreshTokenEntry.save();
      }
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: '5m' }
    );

    res.json({ accessToken, refreshToken: refreshTokenEntry.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
