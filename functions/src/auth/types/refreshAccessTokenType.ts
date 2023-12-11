export type IRefreshAccessToken = {
  _id: string;
  userId: string;
  username: string;
  token: string;
  expiresAt: Date;
};

export type IRefreshAccessTokenWithoutId = Omit<IRefreshAccessToken, '_id'>;
