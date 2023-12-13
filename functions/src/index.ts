import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import * as functions from 'firebase-functions';
import { connect } from 'mongoose';
dotenv.config();

import { corsOptions } from './corsConfig';
import characterRoute from './routes/characterRoute';
import characterStatsRoute from './routes/characterStatsRoute';
import characterTypeRoute from './routes/characterTypeRoute';
import checkGuildRelationStatusRoute from './routes/checkGuildRelationStatusRoute';
import checkNameUniquenessRoute from './routes/checkNameUniquenessRoute';
import guildRoute from './routes/guildRoute';
import guildStatsRoute from './routes/guildStatsRoute';
import isGuildFull from './routes/isGuildFullRoute';
import checkIfMemberRoute from './routes/isMemberRoute';

const app = express();

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
