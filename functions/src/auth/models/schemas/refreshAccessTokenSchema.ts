import { Schema, model } from 'mongoose';
import { IRefreshAccessTokenWithoutId } from '../../types/refreshAccessTokenType';

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
