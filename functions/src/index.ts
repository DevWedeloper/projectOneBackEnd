import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import * as functions from 'firebase-functions';
import { corsOptions } from './cors-config';
import { errorHandler } from './middlewares/error-handler';
import characterRoute from './routes/character-route';
import characterStatsRoute from './routes/character-stats-route';
import characterTypeRoute from './routes/character-type-route';
import checkGuildRelationStatusRoute from './routes/check-guild-relation-status-route';
import checkNameUniquenessRoute from './routes/check-name-uniqueness-route';
import guildRoute from './routes/guild-route';
import guildStatsRoute from './routes/guild-stats-route';
import isGuildFull from './routes/is-guild-full-route';
import checkIfMemberRoute from './routes/is-member-route';

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());
app.use('/character', characterRoute);
app.use('/guild', guildRoute);
app.use('/characterStats', characterStatsRoute);
app.use('/guildStats', guildStatsRoute);
app.use('/characterTypes', characterTypeRoute);
app.use('/', checkNameUniquenessRoute);
app.use('/', checkGuildRelationStatusRoute);
app.use('/', checkIfMemberRoute);
app.use('/', isGuildFull);
app.use(errorHandler);

if (process.env.NODE_ENV === 'dev') {
  app.listen(process.env.MY_PORT, () => {
    console.log(`Server is running on PORT ${process.env.MY_PORT}`);
  });
}

export const api = functions.https.onRequest(app);
