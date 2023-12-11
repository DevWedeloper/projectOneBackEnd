import { Schema, model } from 'mongoose';
import {
  IRefreshAccessToken,
  IRefreshAccessTokenWithoutId,
} from '../types/refreshAccessTokenType';

const RefreshTokenSchema: Schema<IRefreshAccessTokenWithoutId> = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const RefreshToken = model<IRefreshAccessTokenWithoutId>(
  'RefreshToken',
  RefreshTokenSchema
);

export const findOneByQuery = async (
  query: Partial<IRefreshAccessToken>
): Promise<IRefreshAccessToken> => {
  return (
    (await RefreshToken.findOne(query)) ||
    throwRefreshAccessTokenNotFoundError()
  );
};

const throwRefreshAccessTokenNotFoundError = () => {
  throw new Error('Refresh token not found.');
};
