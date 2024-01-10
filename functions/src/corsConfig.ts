import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  process.env.ALLOWED_ORIGIN_VERCEL,
];

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (arg0: Error | null, arg1: boolean | undefined) => void
  ) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
};