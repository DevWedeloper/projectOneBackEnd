import express, { Application } from 'express';
import { connect } from 'mongoose';
import * as functions from 'firebase-functions';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import characterRoute from './routes/characterRoute';
import guildRoute from './routes/guildRoute';
import characterStatsRoute from './routes/characterStatsRoute';
import guildStatsRoute from './routes/guildStatsRoute';
import characterTypeRoute from './routes/characterTypeRoute';
import checkNameUniquenessRoute from './routes/checkNameUniquenessRoute';
import checkGuildRelationStatusRoute from './routes/checkGuildRelationStatusRoute';
import checkIfMemberRoute from './routes/isMemberRoute';
import isGuildFull from './routes/isGuildFullRoute';

const app: Application = express();

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  process.env.ALLOWED_ORIGIN_VERCEL,
];
const corsOptions = {
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
};

app.use(cors(corsOptions));

const connectToDatabase = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log('DB connected');
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
};

// connectToDatabase();
app.use(express.json());

app.use('/character', characterRoute);
app.use('/guild', guildRoute);
app.use('/characterStats', characterStatsRoute);
app.use('/guildStats', guildStatsRoute);
app.use('/characterTypes', characterTypeRoute);
app.use('/', checkNameUniquenessRoute);
app.use('/', checkGuildRelationStatusRoute);
app.use('/', checkIfMemberRoute);
app.use('/', isGuildFull);

// app.listen(process.env.MY_PORT, () => {
//   console.log(`Server is running on PORT ${process.env.MY_PORT}`);
// });

export const api = functions.https.onRequest((connectToDatabase(), app));
