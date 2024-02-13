import dotenv from 'dotenv';
import { connect, connection } from 'mongoose';
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

export const closeConnection = async () => {
  try {
    await connection.close();
  } catch (err) {
    console.error('Error closing DB connection:', err);
    throw new Error('Error closing DB connection');
  }
};
