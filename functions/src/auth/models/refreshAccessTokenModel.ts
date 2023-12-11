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

export const create = async (
  token: IRefreshAccessTokenWithoutId
): Promise<IRefreshAccessToken> => {
  return (await RefreshToken.create(token)).toObject();
};

export const findOneByQuery = async (
  query: Partial<IRefreshAccessToken>
): Promise<IRefreshAccessToken> => {
  return (
    (await RefreshToken.findOne(query)) ||
    throwRefreshAccessTokenNotFoundError()
  );
};

export const isUnique = async ({
  userId,
}: {
  userId: string;
}): Promise<IRefreshAccessToken | null> => {
  return await RefreshToken.findOne({ userId });
};

export const updateById = async (
  id: string,
  query: Partial<IRefreshAccessTokenWithoutId>
): Promise<IRefreshAccessToken> => {
  return (
    (
      await RefreshToken.findByIdAndUpdate(id, query, {
        new: true,
        runValidators: true,
      })
    )?.toObject() || throwRefreshAccessTokenNotFoundError()
  );
};

const throwRefreshAccessTokenNotFoundError = () => {
  throw new Error('Refresh token not found.');
};
