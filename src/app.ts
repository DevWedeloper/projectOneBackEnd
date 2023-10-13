import express, { Application } from 'express';
import { connect } from 'mongoose';
import cron from 'node-cron';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { refreshTokenCleanup } from './cron/refreshTokenCleanup'
import userRouter from './routes/userRoute';
import loginRoute from './routes/loginRoute';
import characterRoute from './routes/characterRoute';
import guildRoute from './routes/guildRoute';
import characterStatsRoute from './routes/characterStatsRoute'
import guildStatsRoute from './routes/guildStatsRoute'
import characterTypeRoute from './routes/characterTypeRoute'

export const app: Application = express();

const allowedOrigins = [process.env.ALLOWED_ORIGIN, process.env.ALLOWED_ORIGIN_VERCEL];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

connect(process.env.DB_URL).then(() => {
  console.log('DB connected');
}).catch((err) => {
  console.error('Error connecting to DB:', err);
});

app.use(express.json());

app.use('/user', userRouter);
app.use('/', loginRoute);
app.use('/character', characterRoute);
app.use('/guild', guildRoute);
app.use('/characterStats', characterStatsRoute);
app.use('/guildStats', guildStatsRoute);
app.use('/characterTypes', characterTypeRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

cron.schedule('0 0 * * *', refreshTokenCleanup);