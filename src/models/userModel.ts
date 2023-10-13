import { Document, Model, Schema, model } from 'mongoose';

interface IUser {
  username: string;
  password: string;
  role: 'admin' | 'standard';
}

export interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {}

const userSchema: Schema<IUserDocument, IUserModel> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'standard'], default: 'standard' },
});

export const User: IUserModel = model<IUserDocument, IUserModel>('User', userSchema);