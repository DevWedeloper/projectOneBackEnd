import dotenv from 'dotenv';
import { connect } from 'mongoose';
dotenv.config();

export const connectToDatabase = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log('DB connected');
  } catch (err) {
    console.error('Error connecting to DB:', err);
    throw new Error('Can not connect to DB.');
  }
};
