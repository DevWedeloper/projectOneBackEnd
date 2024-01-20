import { JwtPayload, verify } from 'jsonwebtoken';

export type VerifyToken = typeof verify;

export type TokenPayload = JwtPayload;
