import { ForbiddenError, UnauthorizedError } from '../utils/errors';
import { TokenPayload, VerifyToken } from './types/jwt.type';

export const makeIsAdmin = ({ verify }: { verify: VerifyToken }) => {
  const isAdmin = (token: string, method: string) => {
    if (!token) {
      throw new UnauthorizedError('Missing token.');
    }

    let decodedToken;
    try {
      decodedToken = verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError(error);
    }

    const user = decodedToken;
    if (user?.role === 'standard' && method !== 'GET') {
      throw new ForbiddenError(
        `Standard users cannot perform the ${method.toLocaleUpperCase()} action.`
      );
    }
  };
  return isAdmin;
};
