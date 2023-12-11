import { Schema, model } from 'mongoose';
import { IRefreshAccessToken } from '../types/refreshAccessTokenType';

const RefreshTokenSchema: Schema<IRefreshAccessToken> = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const RefreshToken = model<IRefreshAccessToken>('RefreshToken', RefreshTokenSchema);
