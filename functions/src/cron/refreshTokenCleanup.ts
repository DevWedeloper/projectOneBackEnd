import {
  RefreshToken,
  IRefreshAccessTokenDocument,
} from '../auth/models/refreshAccessTokenModel';

export async function refreshTokenCleanup() {
  try {
    const expiredTokens: IRefreshAccessTokenDocument[] =
      await RefreshToken.find({ expiresAt: { $lt: new Date() } });

    await RefreshToken.deleteMany({ expiresAt: { $lt: new Date() } });

    console.log(`Deleted ${expiredTokens.length} expired refresh tokens.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error cleaning up expired refresh tokens:', error.message);
    }
  }
}
