import {
  IRefreshAccessToken,
  IRefreshAccessTokenWithoutId,
} from '../types/refreshAccessTokenType';
import { RefreshToken } from './schemas/refreshAccessTokenSchema';

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
